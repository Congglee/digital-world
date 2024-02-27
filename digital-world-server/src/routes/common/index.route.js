import commonAuthRouter from "./common-auth.route";
import commonMediaRouter from "./common-media.route";
import commonUserRouter from "./common-user.route";
import commonProductRouter from "./common-product.route";
import commonCategoryRouter from "./common-category.route";

const commonRoutes = {
  prefix: "/",
  routes: [
    {
      path: "",
      route: commonAuthRouter,
    },
    {
      path: "",
      route: commonUserRouter,
    },
    {
      path: "products",
      route: commonProductRouter,
    },
    {
      path: "categories",
      route: commonCategoryRouter,
    },
    {
      path: "media",
      route: commonMediaRouter,
    },
  ],
};

export default commonRoutes;