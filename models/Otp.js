const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');

const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60
    }
})

async function sendVerificationMail(email,otp)
{
    try{
        const mailResponse = await mailSender(email, "Verification Email from JOBSEEKUSER", `<h4>Dear candidate</h4> <p>Welcome to the Jobseekuser portal!</p> <p>Please use</p> <h2>${otp}</h2> <p>As OTP to validate your Email ID in Jobseekuser portal!</p> <p>This email was intended for Candidate. Why we have added your details in this email. Do not reply to this email as it is not monitored.</p><p>@jobseekuser</p>`)
        
    }
    catch(err)
    {
        console.log(`Error occured while sending mail ${err}`);
    }
}


OTPSchema.pre('save', async function(next){
    await sendVerificationMail(this.email, this.otp);
    next();
})


module.exports = mongoose.model('Otp',OTPSchema)