const mongoose = require('mongoose');

const forgetPasswordSchema = new mongoose.Schema({
    email: String,
    otp: String,
    expireAt: {
        type: Date,
        expires: 300 //5phut
    }
    // if 'expireAt' is set, then document expires at expireAt + 60 seconds
}, { timestamps: true });
const ForgetPassword = mongoose.model("ForgetPassword", forgetPasswordSchema, "forget-password");

export default ForgetPassword;