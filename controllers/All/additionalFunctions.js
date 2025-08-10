import { JobPrice, User } from '../../models/index.js';
import { Op } from "sequelize";
  import nodemailer from 'nodemailer'

export const findPrices = async (price) => {
  try {
    const jobprice = await JobPrice.findOne({
      where: {
        min_price: { [Op.lte]: price },
        max_price: { [Op.gte]: price }
      }
    });
    // If found, return required_connect else default to 5
    return jobprice ? jobprice.required_connect : 5;
  } catch (err) {
    console.error(err);
    // Throw the error so the caller can handle it
    throw err;
  }
};

export const totalJobPosted = async (price) => {
  try {
    const jobprice = await JobPrice.findOne({
      where: {
        min_price: { [Op.lte]: price },
        max_price: { [Op.gte]: price }
      }
    });
    // If found, return required_connect else default to 5
    return jobprice ? jobprice.required_connect : 5;
  } catch (err) {
    console.error(err);
    // Throw the error so the caller can handle it
    throw err;
  }
};

export const totalJobApplied = async (price) => {
  try {
    const jobprice = await JobPrice.findOne({
      where: {
        min_price: { [Op.lte]: price },
        max_price: { [Op.gte]: price }
      }
    });
    // If found, return required_connect else default to 5
    return jobprice ? jobprice.required_connect : 5;
  } catch (err) {
    console.error(err);
    // Throw the error so the caller can handle it
    throw err;
  }
};


export const userNameexist = async (req,res) => {
  try {
    const {username} = req.query;
    
    const usernameExist = await User.findOne({
      attributes: ['username'],
      where: {
        username
      }
    });
    const exists = !!usernameExist;
    res.status(201).json(exists);
  } catch (err) {
    console.error(err);
    // Throw the error so the caller can handle it
    throw err;
  }
};


  
export const sendEmail = async (to, subject, title = "Email Verification", code) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "leulkahssaye1000@gmail.com",
      pass: "csujqjgvhpcwkvnm"
    }
  });

  const mailOptions = {
    from: "AdTera <leulkahssaye1000@gmail.com>",
    to: to,
    subject: subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          /* Base styles */
          body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f7f9fc;
          }
          
          /* Email container */
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          
          /* Card styling */
          .email-card {
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            overflow: hidden;
            padding: 32px;
          }
          
          /* Header */
          .header {
            text-align: center;
            margin-bottom: 24px;
          }
          
          .logo {
            color: #2563eb;
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 8px;
          }
          
          /* Content */
          .content {
            margin-bottom: 24px;
          }
          
          .verification-code {
            background: #f8fafc;
            border: 1px dashed #cbd5e1;
            border-radius: 8px;
            padding: 16px;
            text-align: center;
            margin: 24px 0;
            font-size: 28px;
            font-weight: 700;
            color: #2563eb;
            letter-spacing: 2px;
          }
          
          /* Footer */
          .footer {
            text-align: center;
            color: #64748b;
            font-size: 12px;
            margin-top: 32px;
            padding-top: 16px;
            border-top: 1px solid #e2e8f0;
          }
          
          /* Responsive adjustments */
          @media only screen and (max-width: 600px) {
            .email-card {
              padding: 24px;
            }
            
            .verification-code {
              font-size: 24px;
              padding: 12px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-card">
            <div class="header">
              <div class="logo">AdTera</div>
              <h1 style="margin: 0; font-size: 20px; color: #1e293b;">${title}</h1>
              <h1 style="margin: 0; font-size: 20px; color: #1e293b;">**PLEASE DO NOT RESPOND TO THIS E-MAIL**</h1>
            </div>
            
            <div class="content">
              <p style="margin: 0 0 16px 0;">Thank you for using AdTera. Please use the following verification code to complete your verification:</p>
              
              <div class="verification-code" color = "#25caebff">${code}</div>
              
              <p style="margin: 16px 0; color: #64748b; font-size: 14px;">
                This code will expire in <strong>5 minutes</strong>. Please do not share this code with anyone.
              </p>
            </div>
            
            <div class="footer">
              <p style="margin: 0;">If you didn't request this code, please ignore this email or contact support.</p>
              <p style="margin: 8px 0 0 0;">© ${new Date().getFullYear()} AdTera. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email sending error:', error);
        reject(error);
      } else {
        console.log('Email sent successfully:', info.response);
        resolve(info.response);
      }
    });
  });
};
