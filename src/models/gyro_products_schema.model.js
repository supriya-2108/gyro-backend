import { Schema, Types } from 'mongoose';
import mongoose from 'mongoose';

const GyroProductsSchema = new Schema({
  product_id: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    required: true,
    default:true
  },
},{
    timestamps: true,
});

const GyroProductsModel = mongoose.model('Gyro_Products', GyroProductsSchema);

export default GyroProductsModel;