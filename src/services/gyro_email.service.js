import nodemailer from 'nodemailer';
import constants from '../config/constants.js';

const gyroEmailService = async ( recipientEmail, otp, websiteUrl ) => {
    try {
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <div style="background-color: #0078d7; color: #ffffff; text-align: center; padding: 20px;">
                <h1 style="margin: 0; font-size: 24px;">Welcome to GYRO Restaurant</h1>
                </div>
                <div style="padding: 20px; color: #333333;">
                <p style="margin: 15px 0; font-size: 16px;">Dear User,</p>
                <p style="margin: 15px 0; font-size: 16px;">Thank you for signing up. To complete your verification, use the OTP below:</p>
                <div style="font-size: 24px; font-weight: bold; color: #0078d7; text-align: center; margin: 20px 0;">${otp}</div>
                <p style="margin: 15px 0; font-size: 16px;">If you didn’t request this, please ignore this email.</p>
                <p style="margin: 15px 0; font-size: 16px;">You can also visit our website by clicking the button below:</p>
                <a href="${websiteUrl}" style="display: inline-block; background-color: #28a745; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 5px; margin: 20px 0; font-size: 16px; font-weight: bold;">Visit Website</a>
                </div>
                <div style="background-color: #f4f4f7; text-align: center; padding: 10px; font-size: 14px; color: #777777;">
                <p style="margin: 0;">If you have any questions, feel free to contact us at support@example.com.</p>
                <p style="margin: 0;">&copy; 2024 Your Company Name. All rights reserved.</p>
                </div>
            </div>
            </body>
            </html>
        `;
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: constants.email_config.email,
                pass: constants.email_config.password,
            }
        });

        const mailOptions = {
            from: 'gyro.delivery@gmail.com',
            to: recipientEmail,
            subject: 'Gyro Restaurant Signup Verification',
            text: 'Thank you for choosing GYRO',
            html: htmlContent
        };

        return await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error);
    }
}

export {
    gyroEmailService
}