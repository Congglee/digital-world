import userUserRouter from "./user-user.route";
import userProductRouter from "./user-product.route";

const userRoutes = {
  prefix: "/",
  routes: [
    { path: "user", route: userUserRouter },
    { path: "product", route: userProductRouter },
  ],
};

export default userRoutes;
