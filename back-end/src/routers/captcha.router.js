// src/routers/captcha.router.js
const express = require('express');
const router = express.Router();
const captchaController = require('../controllers/captcha.controller');

router.get('/captcha/create', captchaController.createCaptcha);
router.post('/captcha/verify', captchaController.verifyCaptcha);

module.exports = router;
