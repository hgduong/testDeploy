// src/controllers/captcha.controller.js
const crypto = require('crypto');

// Lưu captcha tạm theo token
const captchaStore = new Map();

// Hàm tạo chuỗi captcha ngẫu nhiên
function generateCaptchaText(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// API tạo captcha
exports.createCaptcha = (req, res) => {
  const captchaText = generateCaptchaText(6);
  const token = crypto.randomBytes(16).toString('hex');

  // Lưu captcha vào store
  captchaStore.set(token, captchaText);

  res.json({
    captcha: captchaText, // frontend sẽ render ra hình hoặc input
    token
  });
};

// API verify captcha
exports.verifyCaptcha = (req, res) => {
  const { token, value } = req.body;
  const expected = captchaStore.get(token);

  if (!expected) {
    return res.status(400).json({ success: false, message: 'Captcha hết hạn hoặc không tồn tại' });
  }

  if (value === expected) {
    captchaStore.delete(token);
    return res.json({ success: true });
  } else {
    // Sai thì tạo captcha mới
    const newCaptcha = generateCaptchaText(6);
    captchaStore.set(token, newCaptcha);
    return res.status(400).json({
      success: false,
      message: 'Captcha không đúng, đã reset',
      captcha: newCaptcha,
      token
    });
  }
};
