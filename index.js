import cors from "cors";
import express from "express";
import constants from "./src/config/constants.js";
import database from "./src/config/database_connection.js";
import adminOperationRouter from "./src/routes/gyro_admin_operation.route.js";
import userOperationRouter from "./src/routes/gyro_user_operation.route.js";
import userRouter from "./src/routes/live_dining_user.route.js";
import paymentRouter from "./src/routes/payment_operation.route.js";

const app = express();
app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send('Welcome to Gyro API! <a href="/api-docs">API Docs</a>');
});

app.use("/user/v1", userRouter);
app.use("/user/v1/operation", userOperationRouter);
app.use("/admin/v1/operation", adminOperationRouter);
app.use("/payment/v1", paymentRouter);

app.listen(constants.port, async () => {
  try {
    await database;
    console.log("Database connection established successfully!");
  } catch (error) {
    console.log(error.message, "not connected");
  }
  console.log(
    "Server is listening on port" +
      constants.port +
      "! =>>> " +
      "http://localhost:3003"
  );
});

export default app;
