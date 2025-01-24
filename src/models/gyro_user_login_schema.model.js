import mongoose from "mongoose";
const Schema = mongoose.Schema;

const gyroUserLoginSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    ref_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    is_active: {
        type: String,
        required: true,
        trim: true,
        default:"Active",
        enum:["Active","Inactive"]
    },
    user_role:{
        type:String,
        required:true,  
        trim:true,
        default:"customer"
    }
},{
    timestamps: true
});

const GyroUserLoginModel = mongoose.model("Gyro_User_Login", gyroUserLoginSchema);

export default GyroUserLoginModel;