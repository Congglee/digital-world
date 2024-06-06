import userUserRouter from "./user-user.route";
import userProductRouter from "./user-product.route";
import userCartRouter from "./user-cart.route";
import userOrderRouter from "./user-order.route";
import userPaymentRouter from "./user-payment.route";

const userRoutes = {
  prefix: "/",
  routes: [
    { path: "users", route: userUserRouter },
    { path: "cart", route: userCartRouter },
    { path: "products", route: userProductRouter },
    { path: "orders", route: userOrderRouter },
    { path: "payment", route: userPaymentRouter },
  ],
};

export default userRoutes;
