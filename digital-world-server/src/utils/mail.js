import nodemailer from "nodemailer";
import * as dotenv from "dotenv";

dotenv.config();

export const sendMail = async ({ email, html, subject }) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_NAME, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let info = await transporter.sendMail({
    from: '"Digital World" <no-reply@digital-world.com>',
    to: email,
    subject: subject,
    html: html,
  });

  return info;
};
