const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Đăng ký
router.post('/register', userController.registerUser);

// Đăng nhập
router.post('/login', userController.loginUser);

// Xác thực email
router.post('/verify-email', userController.verifyEmailCode);

// Gửi lại mã xác thực
router.post('/resend-code', userController.resendVerificationCode);

// Hủy đăng ký (sai quá 5 lần)
router.post('/cancel-register', userController.cancelRegister);

// Xem tất cả tài khoản (chỉ Admin)
router.get('/all', verifyToken, isAdmin, userController.getAllUsers);

//Kiểm tra mật khẩu
router.post('/check-password', userController.checkPassword);


router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);


module.exports = router;

