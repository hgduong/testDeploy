// src/pages/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:9999/api/users/forgot-password', { email });
      setIsSuccess(true);
      setPopupMessage(res.data.message);
      setShowPopup(true);
      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);
        navigate('/login');
      }, 2000);
    } catch (err) {
      setIsSuccess(false);
      setPopupMessage(err.response?.data?.message || 'Có lỗi xảy ra');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2500);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔑 Quên mật khẩu</h2>
        <p style={styles.subtitle}>
          Nhập email để nhận mã khôi phục mật khẩu qua Gmail
        </p>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" style={styles.button}>
            Gửi mã khôi phục
          </button>
        </form>
        <div style={{ marginTop: '1rem' }}>
          <button
            className="btn btn-link"
            onClick={() => navigate('/login')}
            style={{ textDecoration: 'none', fontSize: '0.9rem' }}
          >
            ← Quay lại đăng nhập
          </button>
        </div>
      </div>

      {/* Popup thông báo */}
      {showPopup && (
        <div style={styles.popupOverlay}>
          <div style={{
            ...styles.popupBox,
            backgroundColor: isSuccess ? '#d4edda' : '#f8d7da',
            color: isSuccess ? '#155724' : '#721c24'
          }}>
            <p style={{ fontWeight: '500', fontSize: '1.1rem' }}>{popupMessage}</p>
            {isLoading && (
              <div style={{ marginTop: '1rem' }}>
                <div className="spinner-border text-primary" role="status"></div>
                <p style={{ marginTop: '0.5rem' }}>Đang xử lý...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    backgroundImage: 'url("/img/auth/background.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '15px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    width: '400px',
    textAlign: 'center'
  },
  title: {
    marginBottom: '1rem',
    fontWeight: 'bold',
    color: '#333'
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#555',
    marginBottom: '1.5rem'
  },
  formGroup: {
    marginBottom: '1rem',
    textAlign: 'left'
  },
  label: {
    fontWeight: '500',
    marginBottom: '0.3rem',
    display: 'block'
  },
  input: {
    width: '100%',
    borderRadius: '10px',
    height: '40px',
    padding: '0 1rem',
    border: '1px solid #ccc'
  },
  button: {
    marginTop: '0.5rem',
    fontWeight: 'bold'
  },
  popupOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  popupBox: {
    padding: '2rem',
    borderRadius: '10px',
    textAlign: 'center',
    width: '350px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
  }
};

export default ForgotPasswordPage;
