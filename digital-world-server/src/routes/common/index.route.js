import commonAuthRouter from "./common-auth.route";
import commonBrandRouter from "./common-brand.route";
import commonCategoryRouter from "./common-category.route";
import commonLocationRouter from "./common-location.route";
import commonMailRouter from "./common-mail.route";
import commonMediaRouter from "./common-media.route";
import commonProductRouter from "./common-product.route";

const commonRoutes = {
  prefix: "/",
  routes: [
    { path: "", route: commonAuthRouter },
    { path: "products", route: commonProductRouter },
    { path: "categories", route: commonCategoryRouter },
    { path: "brands", route: commonBrandRouter },
    { path: "media", route: commonMediaRouter },
    { path: "location", route: commonLocationRouter },
    { path: "mail", route: commonMailRouter },
  ],
};

export default commonRoutes;
