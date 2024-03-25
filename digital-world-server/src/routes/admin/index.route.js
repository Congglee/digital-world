import adminCategoryRouter from "./admin-category.route";
import adminUserRouter from "./admin-user.route";
import adminProductRouter from "./admin-product.route";
import adminBrandRouter from "./admin-brand.route";

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
    {
      path: "brands",
      route: adminBrandRouter,
    },
  ],
};

export default adminRoutes;
