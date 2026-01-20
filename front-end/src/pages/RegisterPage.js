import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    gender: 'Nam',
    birthDate: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setShowPopup(false);

    const {
      email, phone, password, confirmPassword, fullName, gender, birthDate, address
    } = formData;

    if (
      !email || !phone || !password || !confirmPassword || !fullName ||
      !gender || !birthDate || !address
    ) {
      setError('Vui lòng điền đầy đủ tất cả các trường thông tin');
      setIsSuccess(false);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      setIsSuccess(false);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu và xác nhận mật khẩu không khớp');
      setIsSuccess(false);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
      return;
    }

    try {
      const res = await axios.post('http://localhost:9999/api/users/register', formData);
      setSuccess(res.data.message);
      setIsSuccess(true);
      setShowPopup(true);
      setIsLoading(true);

      localStorage.setItem('userId', res.data.userId);

      setTimeout(() => {
        setIsLoading(false);
        navigate('/verify-email');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
      setIsSuccess(false);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Form đăng ký */}
        <div style={styles.formBox}>
          <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
            <button
              onClick={() => navigate('/login')}
              className="btn btn-link"
              style={{ textDecoration: 'none', color: '#007bff', fontSize: '1rem' }}
            >
              ← Quay lại đăng nhập
            </button>
          </div>

          <h2 style={{ marginBottom: '1.5rem' }}>📝 Đăng ký tài khoản</h2>
          <form onSubmit={handleRegister}>
            <input type="text" name="fullName" placeholder="Họ và tên"
              value={formData.fullName} onChange={handleChange}
              style={styles.input} required /><br />
            <input type="email" name="email" placeholder="Email"
              value={formData.email} onChange={handleChange}
              style={styles.input} required /><br />
            <input type="text" name="phone" placeholder="Số điện thoại"
              value={formData.phone} onChange={handleChange}
              style={styles.input} required /><br />
            <select name="gender" value={formData.gender} onChange={handleChange}
              style={{ ...styles.input, height: '40px' }}>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select><br />
            <input type="date" name="birthDate"
              value={formData.birthDate} onChange={handleChange}
              style={styles.input} /><br />
            <input type="text" name="address" placeholder="Địa chỉ"
              value={formData.address} onChange={handleChange}
              style={styles.input} /><br />

            {/* Mật khẩu */}
            <div style={styles.passwordGroup}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                required
              />
              <span onClick={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                {showPassword ? '🙈' : '👁'}
              </span>
            </div>

            {/* Xác nhận mật khẩu */}
            <div style={styles.passwordGroup}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={styles.input}
                required
              />
              <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                {showConfirmPassword ? '🙈' : '👁'}
              </span>
            </div>

            <button type="submit" className="btn btn-success w-100 mt-3">
              Đăng ký
            </button>
          </form>
        </div>

        {/* Ảnh minh họa */}
        <div style={styles.imageBox}>
          <img
            src="/img/auth/HinhAnhRegister.png"
            alt="Đăng ký minh họa"
            style={{ width: '120%', height: '714px', borderRadius: '0 15px 15px 0' }}
          />
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div style={{
          ...styles.popup,
          backgroundColor: isSuccess ? '#d4edda' : '#f8d7da', // xanh lá khi thành công, đỏ khi lỗi
          color: isSuccess ? '#155724' : '#721c24'
        }}>
          <p style={{ fontWeight: '500', fontSize: '1.1rem' }}>
            {isSuccess ? success : error}
          </p>
          {isLoading && (
            <div style={{ marginTop: '1rem' }}>
              <div className="spinner-border text-success" role="status"></div>
              <p style={{ marginTop: '0.5rem' }}>Đang chuyển sang xác thực email...</p>
            </div>
          )}
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
    justifyContent: 'center',
    backgroundColor: 'graylight'
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',



  },
  formBox: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '15px 0 0 15px ',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    width: '450px',
    textAlign: 'center'
  },
  imageBox: {
    width: '450px'
  },
  input: {
    width: '100%',
    borderRadius: '10px',
    height: '40px',
    marginBottom: '1rem',
    padding: '0 1rem',
    border: '1px solid #ccc'
  },
  passwordGroup: {
    position: 'relative',
    marginBottom: '1rem'
  },
  eyeIcon: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    marginTop: '-10px',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    fontSize: '1.2rem'
  },
  popup: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    zIndex: 9999,
    textAlign: 'center',
    width: '350px'
  }
};

export default RegisterPage;
