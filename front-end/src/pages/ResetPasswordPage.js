import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ thêm state để toggle hiển thị mật khẩu
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const currentPassword = localStorage.getItem('currentPassword'); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setIsSuccess(false);
      setPopupMessage('❌ Vui lòng nhập đầy đủ thông tin');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2500);
      return;
    }

    if (newPassword.length < 6) {
      setIsSuccess(false);
      setPopupMessage('❌ Mật khẩu phải có ít nhất 6 ký tự');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2500);
      return;
    }

    if (currentPassword && newPassword === currentPassword) {
      setIsSuccess(false);
      setPopupMessage('❌ Mật khẩu mới không được trùng với mật khẩu đang dùng');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2500);
      return;
    }

    if (newPassword !== confirmPassword) {
      setIsSuccess(false);
      setPopupMessage('❌ Mật khẩu xác nhận không khớp');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2500);
      return;
    }

    try {
      const res = await axios.post('http://localhost:9999/api/users/reset-password', {
        userId,
        newPassword
      });
      setIsSuccess(true);
      setPopupMessage(res.data.message);
      setShowPopup(true);
      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);
        navigate('/');
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
        <h2 style={styles.title}>🔒 Đổi mật khẩu mới</h2>
        <form onSubmit={handleSubmit}>
          {/* ✅ Mật khẩu mới với icon ẩn/hiện */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Mật khẩu mới</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={styles.input}
              />
              <span
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  fontSize: '1.2rem'
                }}
              >
                {showNewPassword ? '🙈' : '👁'}
              </span>
            </div>
          </div>

          {/* ✅ Xác nhận mật khẩu với icon ẩn/hiện */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Xác nhận mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={styles.input}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  fontSize: '1.2rem'
                }}
              >
                {showConfirmPassword ? '🙈' : '👁'}
              </span>
            </div>
          </div>

          <button type="submit" className="btn btn-success w-100" style={styles.button}>
            Xác nhận
          </button>
        </form>
      </div>

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
                <div className="spinner-border text-success" role="status"></div>
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
    marginBottom: '1.5rem',
    fontWeight: 'bold',
    color: '#333'
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
    marginTop: '1rem',
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

export default ResetPasswordPage;
