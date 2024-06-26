import cron from "node-cron";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { UserModel } from "../database/models/user.model";
import chalk from "chalk";
import { VERIFY_STATUS } from "../constants/verify.enum";

dotenv.config();

// Connect to the database if not already connected
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
}

const removeExpiredUsers = async () => {
  const now = new Date();
  console.log(chalk.blueBright(`Running cron job at ${now}`));
  try {
    const result = await UserModel.deleteMany({
      verify: VERIFY_STATUS.UNVERIFIED,
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
};

// Schedule a cron job to run every minute
const userCleanUpJob = cron.schedule("* * * * *", removeExpiredUsers);
userCleanUpJob.start();
