import { format } from 'date-fns'
import { Order } from 'src/types/order.type'
import { formatCurrency } from 'src/utils/utils'

export function generateOrderNotifyEmail(order: Order) {
  if (!order) return ''
  return `<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; margin: 0; padding: 0;">
  <div style="max-width: 880px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 5px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center;">
      <img src="https://res.cloudinary.com/di3eto0bg/image/upload/v1712352612/digital-world/logo_tx9mt2.png" alt="Shop Logo" style="max-width: 100%; height: auto; margin-bottom: 20px;">
    </div>
    <div style="background-color: #3498db; color: #fff; padding: 20px; text-align: center; border-top-left-radius: 5px; border-top-right-radius: 5px;">
      <h1>Xác nhận đơn hàng</h1>
    </div>
    <div style="margin-top: 20px; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
      <h2 style="margin-top: 0; color: #333;">Cảm ơn!</h2>
      <p>Kính gửi ${order.order_by.user_fullname},</p>
      <p>Chúng tôi xin chân thành cảm ơn bạn đã mua hàng ở cửa hàng chúng tôi.</p>
      <p>Nếu có bất cứ thông tin gì mới nhất liên quan đến đơn hàng của bạn, chúng tôi sẽ thông báo lại cho bạn qua mail sau nên mong bạn hãy để ý mail.</p>
      <p>Dưới đây là những thông tin chi tiết về đơn hàng của bạn:</p>
      <div style="margin-bottom: 10px;">
        <strong>Mã đơn hàng:</strong> ${order.order_code}
      </div>
      <div style="margin-bottom: 10px;">
        <strong>Ngày đặt hàng:</strong> ${format(order.date_of_order, 'dd/MM/yyyy')}
      </div>
      <div style="margin-bottom: 10px;">
        <strong>Trạng thái đơn hàng:</strong> ${order.order_status}
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr>
          <th style="border: 1px solid #ddd; padding: 10px; text-align: left; background-color: #f2f2f2;">Sản phẩm</th>
          <th style="border: 1px solid #ddd; padding: 10px; text-align: left; background-color: #f2f2f2;">Ảnh</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: left; background-color: #f2f2f2;">Số lượng</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: left; background-color: #f2f2f2;">Giá</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: left; background-color: #f2f2f2;">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
        ${order.products
          .map((product) => {
            return `<tr>
              <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">${product.product_name}</td>
              <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">
                <img src="${product.product_thumb}" alt="{{this.name}}" style="max-width: 100%; height: auto;">
              </td>
              <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">${product.buy_count}</td>
              <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">${formatCurrency(product.product_price)}đ</td>
              <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">${formatCurrency(product.buy_count * product.product_price)}đ</td>
            </tr>`
          })
          .join('')}
        </tbody>
      </table>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr>
          <td style="padding: 10px; font-weight: bold; color: #333; border: 1px dotted #ddd;">Tóm tắt đơn hàng</td>
          <td style="padding: 10px; font-weight: bold; color: #333; border: 1px dotted #ddd;"></td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px dotted #ddd;">Tổng phụ</td>
          <td style="padding: 10px; text-align: right; border: 1px dotted #ddd;">${formatCurrency(order.total_amount)}đ</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px dotted #ddd;">Phí vận chuyển</td>
          <td style="padding: 10px; text-align: right; border: 1px dotted #ddd;">0.00đ</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px dotted #ddd;">Tổng tiền</td>
          <td style="padding: 10px; text-align: right; border: 1px dotted #ddd;">${formatCurrency(order.total_amount)}đ</td>
        </tr>
      </table>
      <div style="margin-top: 20px;">
        <h3 style="font-weight: bold; color: #333;">Phương thức thanh toán</h3>
        <div style="color: #666;">
          ${order.payment_method}
        </div>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr>
          <td style="width: 50%; padding: 10px; border: 1px dotted #ddd;">
            <h3 style="font-weight: bold; color: #333;">Thông tin thanh toán</h3>
            <div style="color: #666;">
              ${order.billing_address.address}<br>
              ${order.billing_address.province}<br>
              ${order.billing_address.district}<br>
              ${order.billing_address.ward}
            </div>
          </td>
          <td style="width: 50%; padding: 10px; border: 1px dotted #ddd;">
            <h3 style="font-weight: bold; color: #333;">Thông tin vận chuyển</h3>
            <div style="color: #666;">
              ${order.shipping_address.address}<br>
              ${order.shipping_address.province}<br>
              ${order.shipping_address.district}<br>
              ${order.shipping_address.ward}<br>
              <br>
              <br>
            </div>
          </td>
        </tr>
      </table>
      <div style="text-align: center; margin-top: 20px;">
        <p>Đây là email tự động. Xin vui lòng không trả lời.</p>
        <p>Truy cập trang web của chúng tôi: <a href="http://localhost:3000/">www.digital-world.com</a></p>
      </div>
  </body>`
}

export function generateRegistrationEmail(otpCode: string) {
  return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="font-size: 24px; color: #333;">Xác nhận đăng ký tài khoản</h2>
    </div>
    <div style="font-size: 16px; color: #555;">
      <p>Cảm ơn bạn đã đăng ký tài khoản với Digital World 2. Vui lòng sử dụng mã OTP sau để xác nhận tài khoản (mã OTP này sẽ hết hạn sau 5 phút kể từ bây giờ):</p>
    <div style="font-size: 20px; color: #00a8e8; padding: 10px; background-color: #f0f0f0; border-radius: 5px; margin-top: 10px;">${otpCode}</div>
    </div>
    <div style="text-align: center; margin-top: 20px; color: #888;">
      <p>Nếu bạn không định đăng ký tài khoản này, vui lòng bỏ qua email này.</p>
    </div>
  </div>`
}

export function generateResetPasswordEmail(token: string) {
  return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="font-size: 24px; color: #333;">Quên mật khẩu</h2>
      </div>
      <div style="font-size: 16px; color: #555;">
        <p style="margin-bottom: 20px;">Vui lòng click vào liên kết bên dưới để thay đổi mật khẩu của bạn. Liên kết này sẽ hết hạn sau 15 phút kể từ bây giờ.</p>
        <a href="${import.meta.env.VITE_CLIENT_URL}/reset-password/${token}" style="display: inline-block; background-color: #00a8e8; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px;">Click vào đây để đặt lại mật khẩu của bạn</a>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #888;">
        <p>Nếu bạn không định đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
      </div>
  </div>`
}
