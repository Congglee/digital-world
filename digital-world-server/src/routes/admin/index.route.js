import adminCategoryRouter from "./admin-category.route";
import adminUserRouter from "./admin-user.route";
import adminProductRouter from "./admin-product.route";

const adminRoutes = {
  prefix: "/admin/",
  routes: [
    {
      path: "users",
      route: adminUserRouter,
    },
    {
      path: "products",
      route: adminProductRouter,
    },
    {
      path: "categories",
      route: adminCategoryRouter,
    },
  ],
};

export default adminRoutes;
