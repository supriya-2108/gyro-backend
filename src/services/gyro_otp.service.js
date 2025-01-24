import { TOTP } from "totp-generator"
import constants from "../config/constants.js";

function generateOtp(secret) {
    try {
      const { otp } = TOTP.generate(secret, {
        digits: 6, 
        period: constants.period
      })
      console.log("===============>>>>>>>>>>>>>>>>>" , otp)
      return otp ;
    } catch (error) {
      console.log(error)
      return error;
    }
  }
  
  function verifyOtp(token, secret) {
    const currentTime = Math.floor(Date.now() / 1000); 
    const steps = Math.floor(constants.window_time * 60 / constants.period);
  
    // Check all valid time steps within the window
    for (let i = -Math.floor(steps / 2); i <= Math.floor(steps / 2); i++) {
      const time = currentTime + i * constants.period; // Shift time by constants.period steps
      const { otp }= TOTP.generate(secret, { period: constants.period, timestamp: time * 1000 });
      console.log(otp)
      if (otp === token) {
        return true; // Token is valid
      }
    }
    return false; // Token is invalid
  }
  
export {
    generateOtp,
    verifyOtp
}
