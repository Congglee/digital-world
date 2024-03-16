import userUserRouter from "./user-user.route";
import userProductRouter from "./user-product.route";
import userCartRouter from "./user-cart.route";

const userRoutes = {
  prefix: "/",
  routes: [
    { path: "user", route: userUserRouter },
    { path: "cart", route: userCartRouter },
    { path: "product", route: userProductRouter },
  ],
};

export default userRoutes;
