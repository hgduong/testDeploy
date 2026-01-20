import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const VerifyEmailPage = () => {
  const [userId, setUserId] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const navigate = useNavigate();
  const intervalRef = useRef(null);

  // Hàm startCountdown giữ nguyên
  const startCountdown = (expireTime) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const remaining = Math.floor((expireTime - Date.now()) / 1000);
    setCountdown(remaining);

    intervalRef.current = setInterval(() => {
      const left = Math.floor((expireTime - Date.now()) / 1000);
      if (left <= 0) {
        clearInterval(intervalRef.current);
        setCountdown(0);
        setMessage('⏳ Mã xác thực đã hết hạn, vui lòng gửi lại.');
        setIsSuccess(false);
        setShowPopup(true);
      } else {
        setCountdown(left);
      }
    }, 1000);
  };

  // Dùng useCallback cho initCountdown
  const initCountdown = useCallback(() => {
    const expireTime = Date.now() + 300000; // 5 phút
    localStorage.setItem('expireTime', expireTime);
    startCountdown(expireTime);
  }, []);

  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    if (storedId) {
      setUserId(storedId);
      initCountdown();
    } else {
      navigate('/register');
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [navigate, initCountdown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage('');
    setShowPopup(false);

    if (countdown <= 0) {
      setMessage('⏳ Mã đã hết hạn, vui lòng gửi lại.');
      setIsSuccess(false);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 1500);
      return;
    }

    try {
      const res = await axios.post('http://localhost:9999/api/users/verify-email', { userId, code });
      setMessage(res.data.message);
      setIsSuccess(res.data.message.includes('thành công'));
      setShowPopup(true);
      setIsLoading(true);

      if (res.data.message.includes('thành công')) {
        setTimeout(() => {
          setIsLoading(false);
          navigate('/login');
        }, 2000);
      } else {
        setTimeout(() => setShowPopup(false), 1500);
      }
    } catch (err) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setMessage(err.response?.data?.message || 'Xác thực thất bại');
      setIsSuccess(false);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 1500);

      if (newAttempts >= 5) {
        // Hiển thị popup thông báo hủy tài khoản + spinner 2s
        setMessage('❌ Sai quá 5 lần, tài khoản đã bị hủy');
        setIsSuccess(false);
        setShowPopup(true);
        setIsLoading(true);

        localStorage.removeItem('userId');
        localStorage.removeItem('expireTime');

        setTimeout(() => {
          setIsLoading(false);
          navigate('/register');
        }, 2000);
      }
    }
  };

  const handleResend = async () => {
    try {
      await axios.post('http://localhost:9999/api/users/resend-code', { userId });
      initCountdown();
      setResendDisabled(true);
      setMessage('📩 Mã mới đã được gửi, vui lòng kiểm tra email.');
      setIsSuccess(true);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    } catch (err) {
      setMessage('Không thể gửi lại mã, vui lòng thử sau.');
      setIsSuccess(false);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    }
  };

  return (
    <div style={{
      backgroundImage: 'url(/img/login/background.jpg)',
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
            onClick={() => navigate('/register')}
            className="btn btn-link"
            style={{ textDecoration: 'none', color: '#007bff', fontSize: '1rem' }}
          >
            ← Quay lại đăng ký
          </button>
        </div>

        <h2 style={{ marginBottom: '1.5rem' }}> Xác thực email</h2>
        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Mã xác thực"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{
              width: '100%',
              borderRadius: '10px',
              height: '40px',
              marginBottom: '1rem',
              padding: '0 1rem',
              border: '1px solid #ccc'
            }}
            required
          />
          <button type="submit" className="btn btn-primary w-100 mb-2">
            Xác thực
          </button>
        </form>
        <button
          onClick={handleResend}
          className="btn btn-secondary w-100"
          disabled={resendDisabled}
          style={{ opacity: resendDisabled ? 0.5 : 1 }}
        >
          Gửi lại mã
        </button>
        {countdown > 0 && (
          <p style={{ marginTop: '1rem', color: '#555' }}>
            ⏳ Mã hết hạn sau {countdown} giây
          </p>
        )}
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
          <p style={{ fontWeight: '500', fontSize: '1.1rem' }}>{message}</p>
          {isLoading && (
            <div style={{ marginTop: '1rem' }}>
              <div className="spinner-border text-primary" role="status"></div>
              <p style={{ marginTop: '0.5rem' }}>Đang chuyển sang đăng nhập...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VerifyEmailPage;


// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const VerifyEmailPage = () => {
//   const [userId, setUserId] = useState('');
//   const [code, setCode] = useState('');
//   const [message, setMessage] = useState('');
//   const [showPopup, setShowPopup] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [countdown, setCountdown] = useState(0);
//   const [resendDisabled, setResendDisabled] = useState(false);
//   const [attempts, setAttempts] = useState(0);

//   const navigate = useNavigate();
//   const intervalRef = useRef(null);

//   useEffect(() => {
//     const storedId = localStorage.getItem('userId');
//     if (storedId) {
//       setUserId(storedId);
//       initCountdown();
//     } else {
//       navigate('/register');
//     }
//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, [navigate]);

//   const initCountdown = () => {
//     const expireTime = Date.now() + 300000; // 5 phút
//     localStorage.setItem('expireTime', expireTime);
//     startCountdown(expireTime);
//   };

//   const startCountdown = (expireTime) => {
//     if (intervalRef.current) clearInterval(intervalRef.current);
//     const remaining = Math.floor((expireTime - Date.now()) / 1000);
//     setCountdown(remaining);

//     intervalRef.current = setInterval(() => {
//       const left = Math.floor((expireTime - Date.now()) / 1000);
//       if (left <= 0) {
//         clearInterval(intervalRef.current);
//         setCountdown(0);
//         setMessage('⏳ Mã xác thực đã hết hạn, vui lòng gửi lại.');
//         setIsSuccess(false);
//         setShowPopup(true);
//       } else {
//         setCountdown(left);
//       }
//     }, 1000);
//   };

//   const handleVerify = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setShowPopup(false);

//     if (countdown <= 0) {
//       setMessage('⏳ Mã đã hết hạn, vui lòng gửi lại.');
//       setIsSuccess(false);
//       setShowPopup(true);
//       setTimeout(() => setShowPopup(false), 1500);
//       return;
//     }

//     try {
//       const res = await axios.post('http://localhost:9999/api/users/verify-email', { userId, code });
//       setMessage(res.data.message);
//       setIsSuccess(res.data.message.includes('thành công'));
//       setShowPopup(true);
//       setIsLoading(true);

//       if (res.data.message.includes('thành công')) {
//         setTimeout(() => {
//           setIsLoading(false);
//           navigate('/login');
//         }, 2000);
//       } else {
//         setTimeout(() => setShowPopup(false), 1500);
//       }
//     } catch (err) {
//       const newAttempts = attempts + 1;
//       setAttempts(newAttempts);
//       setMessage(err.response?.data?.message || 'Xác thực thất bại');
//       setIsSuccess(false);
//       setShowPopup(true);
//       setTimeout(() => setShowPopup(false), 1500);

//       if (newAttempts >= 5) {
//         // Hiển thị popup thông báo hủy tài khoản + spinner 2s
//         setMessage('❌ Sai quá 5 lần, tài khoản đã bị hủy');
//         setIsSuccess(false);
//         setShowPopup(true);
//         setIsLoading(true);

//         // Xóa localStorage
//         localStorage.removeItem('userId');
//         localStorage.removeItem('expireTime');

//         // Sau 2s mới quay lại trang đăng ký
//         setTimeout(() => {
//           setIsLoading(false);
//           navigate('/register');
//         }, 2000);
//       }
//     }
//   };



//   const handleResend = async () => {
//     try {
//       await axios.post('http://localhost:9999/api/users/resend-code', { userId });
//       initCountdown();
//       setResendDisabled(true);
//       setMessage('📩 Mã mới đã được gửi, vui lòng kiểm tra email.');
//       setIsSuccess(true);
//       setShowPopup(true);
//       setTimeout(() => setShowPopup(false), 2000);
//     } catch (err) {
//       setMessage('Không thể gửi lại mã, vui lòng thử sau.');
//       setIsSuccess(false);
//       setShowPopup(true);
//       setTimeout(() => setShowPopup(false), 2000);
//     }
//   };

//   return (
//     <div style={{
//       backgroundImage: 'url(/img/login/background.jpg)',
//       backgroundSize: 'cover',
//       backgroundPosition: 'center',
//       minHeight: '100vh',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center'
//     }}>
//       <div style={{
//         backgroundColor: 'white',
//         padding: '2rem',
//         borderRadius: '15px',
//         boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
//         width: '400px',
//         textAlign: 'center'
//       }}>
//         <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
//           <button
//             onClick={() => navigate('/register')}
//             className="btn btn-link"
//             style={{ textDecoration: 'none', color: '#007bff', fontSize: '1rem' }}
//           >
//             ← Quay lại đăng ký
//           </button>
//         </div>

//         <h2 style={{ marginBottom: '1.5rem' }}>📧 Xác thực email</h2>
//         <form onSubmit={handleVerify}>
//           <input
//             type="text"
//             placeholder="Mã xác thực"
//             value={code}
//             onChange={(e) => setCode(e.target.value)}
//             style={{
//               width: '100%',
//               borderRadius: '10px',
//               height: '40px',
//               marginBottom: '1rem',
//               padding: '0 1rem',
//               border: '1px solid #ccc'
//             }}
//             required
//           />
//           <button type="submit" className="btn btn-primary w-100 mb-2">
//             Xác thực
//           </button>
//         </form>
//         <button
//           onClick={handleResend}
//           className="btn btn-secondary w-100"
//           disabled={resendDisabled}
//           style={{ opacity: resendDisabled ? 0.5 : 1 }}
//         >
//           Gửi lại mã
//         </button>
//         {countdown > 0 && (
//           <p style={{ marginTop: '1rem', color: '#555' }}>
//             ⏳ Mã hết hạn sau {countdown} giây
//           </p>
//         )}
//       </div>

//       {showPopup && (
//         <div style={{
//           position: 'fixed',
//           top: '50%',
//           left: '50%',
//           transform: 'translate(-50%, -50%)',
//           backgroundColor: isSuccess ? '#d4edda' : '#f8d7da',
//           color: isSuccess ? '#155724' : '#721c24',
//           padding: '2rem',
//           borderRadius: '10px',
//           boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
//           zIndex: 9999,
//           textAlign: 'center',
//           width: '350px'
//         }}>
//           <p style={{ fontWeight: '500', fontSize: '1.1rem' }}>{message}</p>
//           {isLoading && (
//             <div style={{ marginTop: '1rem' }}>
//               <div className="spinner-border text-primary" role="status"></div>
//               <p style={{ marginTop: '0.5rem' }}>Đang chuyển sang đăng nhập...</p>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default VerifyEmailPage;
