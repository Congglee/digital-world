import nodemailer from "nodemailer";
import * as dotenv from "dotenv";

dotenv.config();

const sendMail = async ({ email, html, subject }) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_NAME, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: '"Tech-Shop" <no-reply@techshop.com>',
    to: email,
    subject: subject,
    html: html,
  });

  return info;
};

const generateRegistrationEmail = (token) => {
  return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
             <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="font-size: 24px; color: #333;">Xác nhận đăng ký tài khoản</h2>
            </div>
            <div style="font-size: 16px; color: #555;">
              <p>Cảm ơn bạn đã đăng ký tài khoản với Digital World 2. Vui lòng sử dụng mã OTP sau để xác nhận tài khoản (mã OTP này sẽ hết hạn sau 15 phút kể từ bây giờ):</p>
            <div style="font-size: 20px; color: #00a8e8; padding: 10px; background-color: #f0f0f0; border-radius: 5px; margin-top: 10px;">${token}</div>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #888;">
              <p>Nếu bạn không định đăng ký tài khoản này, vui lòng bỏ qua email này.</p>
            </div>
        </div>
  `;
};

const generateResetPasswordEmail = (token) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="font-size: 24px; color: #333;">Quên mật khẩu</h2>
      </div>
      <div style="font-size: 16px; color: #555;">
        <p style="margin-bottom: 20px;">Vui lòng click vào liên kết bên dưới để thay đổi mật khẩu của bạn. Liên kết này sẽ hết hạn sau 15 phút kể từ bây giờ.</p>
        <a href="${process.env.CLIENT_URL}/resetpassword/${token}" style="display: inline-block; background-color: #00a8e8; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px;">Click vào đây để đặt lại mật khẩu của bạn</a>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #888;">
        <p>Nếu bạn không định đặt lại mật khẩu này, vui lòng bỏ qua email này.</p>
      </div>
    </div>`;
};

export { sendMail, generateRegistrationEmail, generateResetPasswordEmail };
