import mongoose from "mongoose";
const Schema = mongoose.Schema;

const gyroUserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    number: {
        type: String,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        required: false,
        trim: true,
    }
},{
    timestamps: true
});

const GyroUserModel = mongoose.model("Gyro_User", gyroUserSchema);

export default GyroUserModel;