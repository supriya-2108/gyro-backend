import { Router } from "express";
const userOperationRouter = Router();
import { check, validationResult } from "express-validator";
import {
  getProductsList,
  addProductToCart,
  removeProductFromCart,
  getCartList,
  getOrderList,
  getUserProfile,
  updateUserProfile,
  createCheckout,
} from "../controllers/gyro_user_operation_controller.js";

userOperationRouter.get("/get_product_list", getProductsList);

userOperationRouter.post("/add_product_to_cart", addProductToCart);

userOperationRouter.delete(
  "/remove_product_from_cart/:id",
  removeProductFromCart
);

userOperationRouter.post("/get_cart_list", getCartList);

userOperationRouter.get("/get_order_list", getOrderList);

userOperationRouter.get("/get_user_profile/:id", getUserProfile);

userOperationRouter.put("/update_user_profile/:id", updateUserProfile);

userOperationRouter.post("/create_checkout", createCheckout);

export default userOperationRouter;
