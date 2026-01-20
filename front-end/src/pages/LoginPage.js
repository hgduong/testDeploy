import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

// Hàm decodePayload để giải mã Unicode trong JWT
function decodePayload(token) {
  const base64 = token.split('.')[1];
  const json = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(json);
}


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [captchaText, setCaptchaText] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [showCaptcha, setShowCaptcha] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Chặn nhảy cóc khỏi trang login
  useEffect(() => {
    if (location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  const fetchCaptcha = async () => {
    try {
      const res = await axios.get('http://localhost:9999/api/captcha/create');
      setCaptchaText(res.data.captcha);
      setCaptchaToken(res.data.token);
      setCaptchaInput('');
    } catch (err) {
      console.error('Captcha error:', err);
    }
  };

  useEffect(() => {
    if (showCaptcha) {
      fetchCaptcha();
    }
  }, [showCaptcha]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setShowPopup(false);

    if (showCaptcha) {
      try {
        const res = await axios.post('http://localhost:9999/api/captcha/verify', {
          token: captchaToken,
          value: captchaInput
        });
        if (!res.data.success) {
          setIsSuccess(false);
          setPopupMessage('❌ Captcha không đúng, vui lòng thử lại.');
          setShowPopup(true);
          fetchCaptcha();
          setTimeout(() => setShowPopup(false), 2500);
          return;
        }
      } catch (err) {
        setIsSuccess(false);
        setPopupMessage('❌ Captcha không đúng, vui lòng thử lại.');
        setShowPopup(true);
        fetchCaptcha();
        setTimeout(() => setShowPopup(false), 2500);
        return;
      }
    }

    try {
      const res = await axios.post('http://localhost:9999/api/users/login', { email, password });
      const { token, isRecoveryLogin } = res.data;

      const payload = decodePayload(token);

      const role = payload.role;

      localStorage.setItem('token', token);
      localStorage.setItem('userId', payload.id);
      localStorage.setItem('role', role);
      localStorage.setItem('email', email);
      localStorage.setItem('fullname', payload.fullname);
      // Lưu avatar nếu server trả về
      if (payload.avatar) {
        localStorage.setItem('avatar', payload.avatar);
      } else {
        localStorage.removeItem('avatar');
      }
      // Thông báo các component trong cùng tab cập nhật
      window.dispatchEvent(new Event('userUpdated'));

      if (isRecoveryLogin) {
        localStorage.setItem('isRecoveryLogin', 'true');
        setIsSuccess(true);
        setPopupMessage('Đăng nhập bằng mật khẩu khôi phục thành công');
        setShowPopup(true);
        setIsLoading(true);

        setTimeout(() => {
          setIsLoading(false);
          navigate('/');
        }, 2000);
        return;
      }

      setIsSuccess(true);
      setPopupMessage('Đăng nhập thành công');
      setShowPopup(true);
      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);
        if (role === 'admin') navigate('/admin-dashboard'); // ✅ admin vào dashboard
        else navigate('/');
      }, 3000);
    } catch (err) {
      if (!showCaptcha) {
        setShowCaptcha(true);
      } else {
        fetchCaptcha();
      }

      setIsSuccess(false);
      setPopupMessage('Đăng nhập thất bại do sai email hoặc mật khẩu. Vui lòng thử lại nhé');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2500);
    }
  };

  return (
    <div style={{
      backgroundImage: 'url(/img/auth/background.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '15px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        width: '400px',
        textAlign: 'center'
      }}>
        <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
          <button
            onClick={() => navigate('/')}
            className="btn btn-link"
            style={{ textDecoration: 'none', color: '#007bff', fontSize: '1rem' }}
          >
            ← Quay lại trang chủ
          </button>
        </div>
        <h2 style={{ marginBottom: '1.5rem' }}>🔒 Đăng nhập</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', borderRadius: '10px', height: '40px', marginBottom: '1rem', padding: '0 1rem' }}
            required
          />
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                borderRadius: '10px',
                height: '40px',
                padding: '0 2.5rem 0 1rem'
              }}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}
            >
              {showPassword ? '🙈' : '👁'}
            </span>
          </div>

          <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="btn btn-link"
              style={{ textDecoration: 'none', fontSize: '0.9rem' }}
            >
              Quên mật khẩu?
            </button>
          </div>

          {showCaptcha && (
            <div style={{ marginBottom: '1rem' }}>
              <div
                style={{
                  userSelect: 'none',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  letterSpacing: '3px',
                  backgroundColor: '#f0f0f0',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  marginBottom: '0.5rem'
                }}
              >
                {captchaText}
              </div>
              <input
                type="text"
                placeholder="Nhập Captcha"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                style={{ width: '100%', borderRadius: '10px', height: '40px', padding: '0 1rem' }}
                required
              />
            </div>
          )}

          <button type="submit" className="btn btn-success w-100">
            Đăng nhập
          </button>
        </form>

        <div style={{ marginTop: '1.5rem' }}>
          <span>Chưa có tài khoản? </span>
          <a href="/register" style={{ color: '#007bff', textDecoration: 'none' }}>Đăng ký</a>
        </div>
      </div>

      {showPopup && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: isSuccess ? '#d4edda' : '#f8d7da',
          color: isSuccess ? '#155724' : '#721c24',
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 9999,
          textAlign: 'center',
          width: '350px'
        }}>
          <p style={{ fontWeight: '500', fontSize: '1.1rem' }}>{popupMessage}</p>
          {isLoading && (
            <div style={{ marginTop: '1rem' }}>
              <div className="spinner-border text-success" role="status"></div>
              <p style={{ marginTop: '0.5rem' }}>Đang xử lý đăng nhập...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoginPage;
