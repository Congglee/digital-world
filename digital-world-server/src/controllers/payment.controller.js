import * as dotenv from "dotenv";
import Stripe from "stripe";
import { PAYMENT_STATUS } from "../constants/purchase";
import { STATUS } from "../constants/status";
import { OrderModel } from "../database/models/order.model";
import { ProductModel } from "../database/models/product.model";
import { UserModel } from "../database/models/user.model";
import { ErrorHandler, responseSuccess } from "../utils/response";
import { generateOrderCode, truncateString } from "../utils/utils";

dotenv.config();

const stripe = Stripe(process.env.STRIPE_KEY);

const getExchangeRate = async () => {
  const response = await fetch(
    "https://api.exchangerate-api.com/v4/latest/VND"
  );
  const data = await response.json();
  return data.rates.USD;
};

const createStripeCheckoutSession = async (req, res) => {
  const form = req.body;
  const {
    order_fullname,
    order_phone,
    order_note,
    payment_method,
    delivery_at,
    products,
  } = form;
  const user_id = req.jwtDecoded.id;
  const userInDB = await UserModel.findById(user_id).lean().exec();
  if (products.length > 0) {
    if (userInDB) {
      const totalAmount = products.reduce(
        (total, product) => total + product.price * product.buy_count,
        0
      );
      const orderCode = generateOrderCode();
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        client_reference_id: orderCode,
        line_items: products.map((product) => ({
          price_data: {
            currency: "vnd",
            product_data: {
              name: product.name,
              images: [product.thumb],
            },
            unit_amount: product.price,
          },
          quantity: product.buy_count,
        })),
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/checkout/success/${orderCode}`,
        cancel_url: `${process.env.CLIENT_URL}/checkout/profile`,
        customer_email: userInDB.email,
        metadata: {
          payment_method,
          delivery_at,
          order_fullname,
          order_phone,
          order_note,
          user_id,
          total_amount: totalAmount,
        },
      });
      return responseSuccess(res, {
        message: "Tạo session thanh toán stripe thành công",
        data: session,
      });
    } else {
      throw new ErrorHandler(STATUS.NOT_FOUND, "Không tìm thấy người dùng");
    }
  } else {
    throw new ErrorHandler(
      STATUS.BAD_REQUEST,
      "Giỏ hàng đang không có sản phẩm nào, không thể tạo đơn hàng"
    );
  }
};

const addOrderForStripePayment = async (session) => {
  const orderCode = session.client_reference_id;
  const {
    delivery_at,
    payment_method,
    user_id,
    order_note,
    order_fullname,
    order_phone,
    total_amount,
  } = session.metadata;
  const userInDB = await UserModel.findById(user_id)
    .populate({
      path: "cart.product",
      select: "name price price_before_discount thumb quantity",
      populate: { path: "category", select: "name" },
    })
    .lean()
    .exec();
  const productsData = userInDB.cart.map((item) => {
    const product = item.product;
    return {
      product_id: product._id,
      product_name: product.name,
      product_price: product.price,
      product_thumb: product.thumb,
      buy_count: item.buy_count,
    };
  });
  const order = {
    order_code: orderCode,
    order_by: {
      user_avatar: userInDB.avatar,
      user_email: userInDB.email,
      user_id,
    },
    products: productsData,
    total_amount: Number(total_amount),
    date_of_order: new Date().toISOString(),
    shipping_address: { order_fullname, order_phone, delivery_at },
    order_note,
    payment_method,
    payment_status: PAYMENT_STATUS.PAID,
  };
  const orderAdd = await new OrderModel(order).save();
  for (const product of productsData) {
    await ProductModel.findByIdAndUpdate(product.product_id, {
      $inc: { sold: product.buy_count, quantity: -product.buy_count },
    });
  }
  return orderAdd;
};

const handleStripeWebhookCheckout = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  const event = stripe.webhooks.constructEvent(
    req.body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  if (event && event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderAddDB = await addOrderForStripePayment(session);
    const response = {
      message: "Tạo mới đơn hàng thành công",
      data: orderAddDB,
    };
    return responseSuccess(res, response);
  }
};

const generatePayPalAccessToken = async () => {
  const response = await fetch(
    `${process.env.PAYPAL_API_BASE_URL}/v1/oauth2/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
        ).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    }
  );
  const result = await response.json();
  return result.access_token;
};

const deletePayPalOrderCancel = async (req, res) => {
  const order_id = req.params.order_id;
  await OrderModel.findByIdAndDelete(order_id).lean();
  return res.redirect(`${process.env.CLIENT_URL}/checkout/profile`);
};

const createPayPalOrder = async (req, res) => {
  const { total_amount, order_code, order_id } = req.body;
  const orderDB = await OrderModel.findById(order_id)
    .populate({
      path: "products.product_id",
      select: "name price price_before_discount thumb quantity",
    })
    .populate({
      path: "order_by.user_id",
      select:
        "name email phone avatar address province district ward date_of_birth",
    })
    .select({ __v: 0 })
    .lean();
  const exchangeRate = await getExchangeRate();
  const accessToken = await generatePayPalAccessToken();

  if (accessToken) {
    const usdAmount = (total_amount * exchangeRate).toFixed(2);
    const response = await fetch(
      `${process.env.PAYPAL_API_BASE_URL}/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              reference_id: order_code,
              custom_id: JSON.stringify({ order_id }),
              items: orderDB.products.map((product) => ({
                name: truncateString(product.product_name, 120),
                quantity: product.buy_count,
                sku: product.product_id._id,
                category: "PHYSICAL_GOODS",
                image_url: product.product_thumb,
                unit_amount: {
                  currency_code: "USD",
                  value: (product.product_price * exchangeRate).toFixed(2),
                },
              })),
              amount: {
                currency_code: "USD",
                value: usdAmount,
                breakdown: {
                  item_total: {
                    currency_code: "USD",
                    value: usdAmount,
                  },
                },
              },
            },
          ],
          payment_source: {
            paypal: {
              experience_context: {
                payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
                brand_name: "Digital World",
                shipping_preference: "NO_SHIPPING",
                user_action: "PAY_NOW",
                return_url: `${process.env.CLIENT_URL}/checkout/success/${order_code}`,
                cancel_url: `${process.env.SERVER_URL}/payment/delete-paypal-order-cancel/${order_id}`,
              },
            },
          },
        }),
      }
    );
    const result = await response.json();

    return responseSuccess(res, {
      message: "Tạo mới đơn hàng PayPal thành công",
      data: result,
    });
  } else {
    throw new ErrorHandler(
      STATUS.INTERNAL_SERVER_ERROR,
      "Lỗi tạo PayPal access token"
    );
  }
};

const handlePayPalWebhookCheckout = async (req, res) => {
  const headers = req.headers;
  const event = JSON.parse(req.body);
  const [eventData] = event.resource.purchase_units;
  const { order_id } = JSON.parse(eventData.custom_id);

  const accessToken = await generatePayPalAccessToken();

  if (accessToken) {
    const response = await fetch(
      `${process.env.PAYPAL_API_BASE_URL}/v1/notifications/verify-webhook-signature`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          transmission_id: headers["paypal-transmission-id"],
          transmission_time: headers["paypal-transmission-time"],
          cert_url: headers["paypal-cert-url"],
          auth_algo: headers["paypal-auth-algo"],
          transmission_sig: headers["paypal-transmission-sig"],
          webhook_id: process.env.PAYPAL_WEBHOOK_ID,
          webhook_event: event,
        }),
      }
    );
    const result = await response.json();
    if (result.verification_status === "SUCCESS") {
      const orderDB = await OrderModel.findByIdAndUpdate(
        order_id,
        { payment_status: PAYMENT_STATUS.PAID },
        { new: true }
      );
      return responseSuccess(res, {
        message: "Cập nhật trạng thái đơn hàng thành công",
        data: orderDB,
      });
    } else {
      await OrderModel.findByIdAndDelete(order_id);
    }
  }
};

const paymentController = {
  createStripeCheckoutSession,
  handleStripeWebhookCheckout,
  generatePayPalAccessToken,
  createPayPalOrder,
  handlePayPalWebhookCheckout,
  deletePayPalOrderCancel,
};

export default paymentController;
