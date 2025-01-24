import { Schema, Types } from 'mongoose';
import mongoose from 'mongoose';

const GyroCheckoutSchema = new Schema({
  user_id: {
    type: Types.ObjectId,
    required: true,
  },
  order_id: {
    type: Types.ObjectId,
    required: true,
  },
  payment_mode: {
    type: String,
    required: true,
  },
  is_applied_promo_code: {
    type: Boolean,
    required: false,
    default:false
  },
  promo_discount: {
    type: Number,
    required: false,
    default:0
  },
  payment_id: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default:"pending",
    enum:["pending","paid","canceled"]
  },
},{
    timestamps: true,
});

const GyroCheckoutModel = mongoose.model('Gyro_Checkout', GyroCheckoutSchema);

export default GyroCheckoutModel;