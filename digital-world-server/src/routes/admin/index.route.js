import adminCategoryRouter from "./admin-category.route";
import adminUserRouter from "./admin-user.route";
import adminProductRouter from "./admin-product.route";
import adminBrandRouter from "./admin-brand.route";
import adminOrderRouter from "./admin-order.route";

const adminRoutes = {
  prefix: "/admin/",
  routes: [
    { path: "users", route: adminUserRouter },
    { path: "products", route: adminProductRouter },
    { path: "categories", route: adminCategoryRouter },
    { path: "brands", route: adminBrandRouter },
    { path: "orders", route: adminOrderRouter },
  ],
};

export default adminRoutes;
