import mongoose from "mongoose";
import constants from "./constants.js";
mongoose.set("strictQuery", false);
console.log(constants.dbConfig.dbUrl);

const database = mongoose.connect(constants.dbConfig.dbUrl);

export default database;
