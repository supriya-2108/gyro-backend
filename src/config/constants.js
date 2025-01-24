import dotenv from "dotenv";

const defaultEnv = "dev";
const defaultPort = 3000;

dotenv.config();

const constants = {
  port: process.env.PORT || defaultPort,
  appName: process.env.APP_NAME,

  dbConfig: {
    dbUrl: process.env.MONGO_URL,

    dbName: process.env.DB_NAME,
    dbMaxConn: process.env.DB_MAX_CONN,
    dbIdleTimeout: process.env.DB_IDLE_TIMEOUT,
    dbMaxUses: process.env.DB_MAX_USES,
  },

  email_config: {
    email: process.env.EMAIL,
    password: process.env.EMAIL_PASS,
  },
  otp_config: {
    secret: process.env.OTP_SECRET_KEY,
    digits: process.env.OTP_DIGITS,
  },
  period: 30,
  window_time: 5,
  jwtSecret: process.env.JWT_SECRET_KEY,
  salt_round: 10,
  jwtAlgorithm: "HS256",

  hashingKey: process.env.HASHING_KEY,
};

export default constants;
