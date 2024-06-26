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
import "./cron-jobs/user-cleanup"; // Import the cron job

import paymentController from "./controllers/payment.controller";
import { isProduction } from "./utils/helper";

const app = express();
connectMongoDB(); // Connect to MongoDB

// Routes configuration
const routes = [{ ...commonRoutes }, { ...adminRoutes }, { ...userRoutes }];

// Init middlewares
app.use(helmet());
app.use(morgan(isProduction ? "combined" : "dev"));
app.use(compression());
const corsOptions = {
  origin: isProduction ? process.env.CLIENT_URL : "*",
};
app.use(cors(corsOptions));

// Stripe Webhook
app.use(
  "/api/stripe-webhook-checkout",
  express.raw({ type: "application/json" }),
  paymentController.handleStripeWebhookCheckout
);

// PayPal Webhook
app.use(
  "/api/paypal-webhook-checkout",
  express.raw({ type: "application/json" }),
  paymentController.handlePayPalWebhookCheckout
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes middleware
routes.forEach((item) =>
  item.routes.forEach((route) =>
    app.use("/api" + item.prefix + route.path, route.route)
  )
);

// Error handling middleware
app.use(function (err, req, res, next) {
  responseError(res, err);
});

// Start the server
app.listen(process.env.PORT, function () {
  console.log(chalk.greenBright(`API listening on port ${process.env.PORT}!`));
});
