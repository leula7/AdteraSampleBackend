import { User } from '../../models/index.js'; // Assuming you have a Job model
import { sendEmail } from './additionalFunctions.js';

const secretCode = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit code

const EmailVerificationController = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const { verificationCode } = req.body;
        if( verificationCode !== secretCode) {
            return res.status(400).json({ success: false,message: 'Invalid verification code.' });
        }
       const response = await User.update(
            { email_verified: 1 },
            { where: { user_id } }
        );
        
         res.status(201).json({success: true, message: 'Your Email is Now Verified' });
    } catch (err) {
        console.error(err);
        res.status(500).json({success: false, message: 'Failed to Verify Email' });
    }
};


const getSececretCode = async (req, res) => {
    try {

        const {user_id} = req.user;

        const getEmail = await User.findOne({
            where: { user_id: user_id },
            attributes: ['email']
        });

        if (!getEmail) {
            return res.status(404).json({success: false, message: 'User not found.' });
        }
        const emailSent = await sendEmail(getEmail.email, 'AdTera Email Verification Code', 'Your verification code is: ' + secretCode +" This Code is valid for 5 minutes");

        if (emailSent.includes('250 2.0.0 OK')) {
            res.status(200).json({success: true, message: 'Verification code sent successfully.' });
        } else {
            res.status(500).json({success: false,message: 'Failed to send verification code email.'});
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({success: false, message: 'Failed to Send Email' });
    }
};


const ForgetPassVerificationController = async (req, res) => {
    try {
        const { verificationCode } = req.body;
        if( verificationCode.trim() !== secretCode.toString().trim()) {
            return res.status(400).json({ success: false,message: 'Invalid verification code.' });
        }else{
            res.status(201).json({ success: true, message: 'Verification Code Success' });
        }  
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to Verify Forgot Password' });
    }
};


const forgetpass = async (req, res) => {
    try {

        const {email} = req.body;
        
        const getEmail = await User.findOne({
            where: { email},
            attributes: ['email']
        });

        if (!getEmail) {
            return res.status(404).json({ message: 'Email not found.' });
        }
        const emailSent = await sendEmail(getEmail.email, 'AdTera Forget Password Email Verification Code', "Forget Password Email Verification",'Your verification code is: ' + secretCode +" This Code is valid for 5 minutes");

        if (emailSent.includes('250 2.0.0 OK')) {
           // await setRedisValue(`forgetPass_verify_code_${email}`, secretCode, 300);
            res.status(200).json({ message: 'Forget Password Verification code sent successfully.' });
        } else {
            res.status(500).json({ message: 'Failed to send Forget Password verification code email.'});
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to Send Email' });
    }
};

export  {EmailVerificationController, getSececretCode,forgetpass, ForgetPassVerificationController};
