import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swaggerConfig.js";
import YAML from "yamljs";
import constants from "./src/config/constants.js";
import database from "./src/config/database_connection.js";
import userRouter from "./src/routes/live_dining_user.route.js";
import userOperationRouter from "./src/routes/gyro_user_operation.route.js";
import adminOperationRouter from "./src/routes/gyro_admin_operation.route.js";
import paymentRouter from "./src/routes/payment_operation.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const { YAML } = pkg;
const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";
const app = express();
app.use(express.json());

app.use(cors());
app.use(express.static(path.join(__dirname, "./src/static")));

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
    console.log(error.message);
  }
  console.log(
    "Server is listening on port" +
      constants.port +
      "! =>>> " +
      "http://localhost:3003"
  );
});

export default app;
