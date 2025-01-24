import { createRecord, getRecord } from "../common/common_database_queries.js";
import GyroUserModel from "../models/gyro_user_schema.model.js";
import { gyroEmailService } from "../services/gyro_email.service.js";
import { generateOtp, verifyOtp } from "../services/gyro_otp.service.js";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";
import constants from "../config/constants.js";
import GyroUserLoginModel from "../models/gyro_user_login_schema.model.js";

const getOtp = async (req, res) => {
    const { email } = req.body;
    try {
        const otp = await generateOtp(constants.otp_config.secret);
        await gyroEmailService( email, otp, "https://localhost:3003/api-docs");
        res.status(200).send({
            message: "OTP generated successfully",
            otp: otp
        })
    } catch ( error ) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};


const createGyroUser = async (req, res) => {
    const { email , otp , password, number } = req.body;
    try {
        let otp_verified = verifyOtp(otp , constants.otp_config.secret);
        if (!otp_verified) {
            return res.status(400).json({ message: "OTP is invalid" });
        }
        const hashedPassword = await bcrypt.hash(password, constants.salt_round);
        const user = await createRecord (GyroUserModel, { email , number });
        await createRecord (GyroUserLoginModel, { email:email, ref_id: user.data._id , password:hashedPassword });
        res.status(200).json({ 
            message: "User created successfully",
            status: true,
            count:1,
            user: user.data
        });
    } catch ( error ) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

const loginGyroUsers = async (req, res) => {
    const { email , password } = req.body;
    try {
        const user = await getRecord(GyroUserLoginModel, { email:email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isPasswordMatched = await bcrypt.compare(password,user.data.password);
        if (!isPasswordMatched) {
            return res.status(400).json({ message: "Password is invalid" });
        }
        const payload = { 
            user_id: user.data.ref_id ,
            user_email: user.data.email ,
            user_role: user.data.user_role,
            user_is_active: user.data.is_active
        };
        const token = JWT.sign(payload , constants.jwtSecret, { algorithm: constants.jwtAlgorithm });
        res.status(200).json({
            message: "Login successful",
            status: true,
            user_info: payload,
            token: token
        });
    } catch ( error ) {
        res.status(500).json({ message: error.message });
    }
}
export {
    getOtp,
    createGyroUser,
    loginGyroUsers
}