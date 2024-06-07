import cron from "node-cron";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { UserModel } from "../database/models/user.model";
import chalk from "chalk";

dotenv.config();

// Connect to the database if not already connected
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
}

// Schedule a cron job to run every minute
cron.schedule("* * * * *", async () => {
  const now = new Date();
  console.log(chalk.blueBright(`Running cron job at ${now}`));
  try {
    const result = await UserModel.deleteMany({
      is_email_verified: false,
      unverified_delete_at: { $lte: now },
    });
    if (result.deletedCount > 0) {
      console.log(
        chalk.greenBright(
          `Deleted ${result.deletedCount} expired users successfully`
        )
      );
    } else {
      console.log(chalk.greenBright("No expired users to delete"));
    }
  } catch (error) {
    console.error(chalk.redBright("Error deleting expired users:", error));
  }
});
