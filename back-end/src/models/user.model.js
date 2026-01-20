// src/models/user.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  gender: { type: String },
  birthDate: { type: Date },
  address: { type: String },

  // Xác thực email
  verificationCode: { type: String },
  verificationCodeExpires: { type: Date },
  verificationAttempts: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },

  // Trạng thái tài khoản
  status: { type: String, default: 'Active' },
  role: { type: String, default: 'user' },

  // Quên mật khẩu / khôi phục
  recoveryPassword: { type: String, default: null },
  recoveryPasswordExpires: { type: Date, default: null }
}, { timestamps: true });

// Hash mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// So sánh mật khẩu
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
