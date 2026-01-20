const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const transporter = require('../../config/mail');
const jwt = require('jsonwebtoken');

// Đăng ký người dùng mới
exports.registerUser = async (req, res) => {
  try {
    const { email, phone, password, fullName, gender, birthDate, address } = req.body;

    // Kiểm tra email hoặc số điện thoại đã tồn tại
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email hoặc số điện thoại đã tồn tại' });
    }

    // Tạo mã xác thực 6 số
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await bcrypt.hash(verificationCode, 10);

    const newUser = new User({
      email,
      phone,
      password,
      fullName,
      gender,
      birthDate,
      address,
      verificationCode: hashedCode,
      verificationCodeExpires: Date.now() + 5 * 60 * 1000, // hết hạn sau 5 phút
      verificationAttempts: 0,
      isVerified: false,
      status: 'Active'
    });

    await newUser.save();

    // Gửi email xác thực với mã gốc
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Xác thực tài khoản đăng nhập website Sắc Vàng Bình An',
      text: `Xin chào ${fullName},\n\nMã xác thực của bạn là: ${verificationCode}\n\nMã này có hiệu lực trong 5 phút.\n\nTrân trọng,\nAdmin: Sắc Vàng Bình An`
    });

    res.status(201).json({ message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực.', userId: newUser._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy danh sách tất cả tài khoản
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Đăng nhập
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('[Auth] login attempt - email:', email);

    const user = await User.findOne({ email });
    if (!user) {
      console.warn('[Auth] user not found for email:', email);
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    console.log('[Auth] user found:', user._id.toString(), 'pwdLength:', user.password ? user.password.length : 0, 'recoverySet:', !!user.recoveryPassword);

    const isMatch = await user.comparePassword(password);
    console.log('[Auth] comparePassword result:', isMatch);

    // Nếu mật khẩu thường sai → kiểm tra mật khẩu phục hồi
    if (!isMatch) {
      const isRecoveryMatch = await bcrypt.compare(password, user.recoveryPassword || '');
      console.log('[Auth] recovery compare result:', isRecoveryMatch, 'recoveryPasswordExpires:', user.recoveryPasswordExpires);
      if (
        user.recoveryPassword &&
        isRecoveryMatch &&
        user.recoveryPasswordExpires > Date.now()
      ) {
        if (!process.env.JWT_SECRET) {
          console.error('[Auth] JWT_SECRET not set');
          return res.status(500).json({ message: 'Server configuration error' });
        }

        const token = jwt.sign(
          { id: user._id, role: user.role, fullname: user.fullName },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        return res.status(200).json({
          message: 'Đăng nhập bằng mật khẩu khôi phục thành công',
          token,
          isRecoveryLogin: true
        });
      }

      return res.status(401).json({ message: 'Sai mật khẩu' });
    }

    // Nếu chưa xác thực email thì chặn đăng nhập
    if (!user.isVerified) {
      console.warn('[Auth] user not verified:', user._id.toString());
      return res.status(403).json({ message: 'Tài khoản chưa xác thực email' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('[Auth] JWT_SECRET not set');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, fullname: user.fullName },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Đăng nhập thành công', token });
  } catch (error) {
    console.error('[Auth] login error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Gửi lại mã xác thực
exports.resendVerificationCode = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    if (user.isVerified) return res.status(400).json({ message: 'Tài khoản đã xác thực' });

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedNewCode = await bcrypt.hash(newCode, 10);

    user.verificationCode = hashedNewCode;
    user.verificationCodeExpires = Date.now() + 5 * 60 * 1000;
    user.verificationAttempts = 0;
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Mã xác thực mới',
      text: `Xin chào ${user.fullName},\n\nMã xác thực mới của bạn là: ${newCode}\n\nMã này có hiệu lực trong 5 phút.\n\nTrân trọng,\nAdmin`
    });

    res.status(200).json({ message: 'Mã mới đã được gửi' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Hủy đăng ký
exports.cancelRegister = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'Tài khoản đã bị hủy do nhập sai quá nhiều lần' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xác thực email
exports.verifyEmailCode = async (req, res) => {
  try {
    const { userId, code } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    if (!user.verificationCodeExpires || user.verificationCodeExpires < Date.now()) {
      return res.status(400).json({ message: 'Mã xác thực đã hết hạn' });
    }

    const isCodeMatch = await bcrypt.compare(code, user.verificationCode || '');
    if (!isCodeMatch) {
      user.verificationAttempts = (user.verificationAttempts || 0) + 1;

      if (user.verificationAttempts >= 5) {
        await User.findByIdAndDelete(userId);
        return res.status(400).json({ message: 'Sai quá 5 lần, tài khoản đã bị hủy' });
      }

      await user.save();
      return res.status(400).json({ message: `Mã xác thực không đúng. Lần thử: ${user.verificationAttempts}` });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    user.verificationAttempts = 0;
    await user.save();

    res.status(200).json({ message: 'Xác thực email thành công' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Gửi mã khôi phục mật khẩu
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng với email này' });

    const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedRecovery = await bcrypt.hash(recoveryCode, 10);

    user.recoveryPassword = hashedRecovery;
    user.recoveryPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Khôi phục mật khẩu đăng nhập',
      text: `Xin chào ${user.fullName},\n\nMã khôi phục mật khẩu của bạn là: ${recoveryCode}\n\nMã này có hiệu lực trong 10 phút.\n\nTrân trọng,\nAdmin`
    });

    res.status(200).json({ message: 'Mã khôi phục đã được gửi qua email' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Đặt lại mật khẩu mới
exports.resetPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    // Kiểm tra độ dài mật khẩu
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự' });
    }

    // Kiểm tra trùng mật khẩu hiện tại
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({ message: 'Mật khẩu mới không được trùng với mật khẩu hiện tại' });
    }

    // Cập nhật mật khẩu mới (sẽ được hash trong middleware model)
    user.password = newPassword;
    user.recoveryPassword = null;
    user.recoveryPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: 'Mật khẩu đã được đặt lại thành công' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Kiểm tra mật khẩu với hash (API test)
exports.checkPassword = async (req, res) => {
  try {
    const { plainPassword, hash } = req.body;
    const isMatch = await bcrypt.compare(plainPassword, hash);
    res.json({ isMatch });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

