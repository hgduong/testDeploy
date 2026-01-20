const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,   // Gmail của bạn
    pass: process.env.EMAIL_PASS    // App password (không dùng mật khẩu thường)
  }
});

module.exports = transporter;
