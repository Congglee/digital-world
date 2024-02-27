import * as dotenv from "dotenv";
import mongoose from "mongoose";
import chalk from "chalk";

dotenv.config();

const connected = chalk.bold.cyan;
const error = chalk.bold.yellow;
const disconnected = chalk.bold.red;
const termination = chalk.bold.magenta;

mongoose.set("strictQuery", false);

// export this function and imported by server.js
export const connectMongoDB = () => {
  mongoose.connect(process.env.MONGODB_URI, {
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  mongoose.connection.on("connected", function () {
    console.log(
      connected("Mongoose default connection is open to MongoDB Atlas")
    );
  });

  mongoose.connection.on("error", function (err) {
    console.log(
      error("Mongoose default connection has occured " + err + " error")
    );
  });

  mongoose.connection.on("disconnected", function () {
    console.log(disconnected("Mongoose default connection is disconnected"));
  });

  process.on("SIGINT", function () {
    mongoose.connection.close(function () {
      console.log(
        termination(
          "Mongoose default connection is disconnected due to application termination"
        )
      );
      process.exit(0);
    });
  });
};
