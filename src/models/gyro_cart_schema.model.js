import { Schema, Types } from 'mongoose';
import mongoose from 'mongoose';

const GyroCartSchema = new Schema({
  user_id: {
    type: Types.ObjectId,
    required: true,
  },
  product_id: {
    type: Types.ObjectId,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  special_note: {
    type: String,
    required: false,
  },
  add_ons: {
    type: String,
    required: false,
  },
},{
    timestamps: true,
});

const GyroCartModel = mongoose.model('Gyro_Cart', GyroCartSchema);

export default GyroCartModel;