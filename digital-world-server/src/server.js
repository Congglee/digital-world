import express from "express";
import cors from "cors";
import chalk from "chalk";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import * as dotenv from "dotenv";

dotenv.config();

import { connectMongoDB } from "./database/database";
import commonRoutes from "./routes/common/index.route";
import adminRoutes from "./routes/admin/index.route";
import userRoutes from "./routes/user/index.route";
import { responseError } from "./utils/response";

const app = express();
connectMongoDB();

const routes = [{ ...commonRoutes }, { ...adminRoutes }, { ...userRoutes }];

// init middlewares
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes.forEach((item) =>
  item.routes.forEach((route) =>
    app.use("/api" + item.prefix + route.path, route.route)
  )
);

app.use(function (err, req, res, next) {
  responseError(res, err);
});

app.listen(process.env.PORT, function () {
  console.log(chalk.greenBright(`API listening on port ${process.env.PORT}!`));
});
