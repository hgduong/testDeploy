import React, { useState, useRef, useEffect } from 'react';
import '../assets/styles/UserMenu.css';
import { useNavigate } from 'react-router-dom';


const UserMenu = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar') || '/img/personal/avatar.png');
  const navigate = useNavigate();

  const avatarRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleLogoutClick = () => {
    setShowConfirm(true);
    setShowDropdown(false);
  };

  const confirmLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      const role = localStorage.getItem('role'); // lấy role từ localStorage
      console.log('ROLE:', role); // ✅ log ra để kiểm tra

      localStorage.removeItem('token');
      localStorage.removeItem('avatar');
      localStorage.removeItem('role');
      localStorage.removeItem('fullname');
      localStorage.removeItem('email');
      localStorage.removeItem('userId');

      // Thông báo các component cùng tab cập nhật trạng thái user
      window.dispatchEvent(new Event('userUpdated'));

      setIsLoggingOut(false);
      setShowConfirm(false);

      if (role === 'admin') {
        navigate('/login', { replace: true });
      } else {
        window.location.reload();
      }
    }, 2000);
  };



  // Đóng khi click ra ngoài
  useEffect(() => {
    const onClickOutside = (e) => {
      if (!avatarRef.current || !dropdownRef.current) return;
      if (
        showDropdown &&
        !avatarRef.current.contains(e.target) &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [showDropdown]);

  // Cập nhật avatar khi localStorage thay đổi hoặc khi login trong cùng tab
  useEffect(() => {
    const updateAvatar = () => setAvatar(localStorage.getItem('avatar') || '/img/personal/avatar.png');
    window.addEventListener('storage', updateAvatar);
    window.addEventListener('userUpdated', updateAvatar);
    return () => {
      window.removeEventListener('storage', updateAvatar);
      window.removeEventListener('userUpdated', updateAvatar);
    };
  }, []);

  return (
    <div style={styles.wrapper}>
      <img
        ref={avatarRef}
        src={avatar}
        alt="Avatar"
        style={styles.avatar}
        onClick={() => setShowDropdown((v) => !v)}
      />

      {showDropdown && (
        <div ref={dropdownRef} style={styles.dropdown}>
          {/* ✅ Thông tin người dùng */}
          <div style={styles.userInfo}>
            <p style={styles.name}>{localStorage.getItem('fullname') || 'Người dùng'}</p>
            <p style={styles.email}>{localStorage.getItem('email') || 'Không có email'}</p>
          </div>

          <ul style={styles.list}>
            <li style={styles.item}>Trạng thái đơn hàng</li>
            <li style={styles.item}>Lịch sử mua hàng</li>
            <li style={styles.item}>Địa chỉ nhận hàng</li>
            <li style={styles.item}>Cài đặt</li>
            <li style={styles.item} onClick={handleLogoutClick}>Đăng xuất</li>
          </ul>
        </div>
      )}

      {showConfirm && (
        <div style={styles.popupOverlay}>
          <div style={styles.popup}>
            <p style={{ marginBottom: '1rem', color: 'black' }}>Bạn có muốn đăng xuất?</p>
            <div style={styles.popupButtons}>
              <button onClick={() => setShowConfirm(false)} style={styles.cancelBtn}>
                Hủy
              </button>
              <button onClick={confirmLogout} style={styles.logoutBtn}>
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoggingOut && (
        <div style={styles.popupOverlay}>
          <div style={styles.popup}>
            <p style={{ marginBottom: '1rem', color: 'black' }}>Đang đăng xuất...</p>
            <div style={styles.spinnerBox}>
              <div className="spinner"></div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

const styles = {
  wrapper: {
    position: 'relative',
    zIndex: 1000,
    overflow: 'visible',
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: '50%',
    objectFit: 'cover',
    cursor: 'pointer'
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 1001,
    minWidth: '200px'
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0
  },
  item: {
    padding: '0.75rem 1rem',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
    fontWeight: '500',
    color: '#333',
    textAlign: 'left'
  },
  popupOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000
  },
  popup: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: 10,
    textAlign: 'center',
    minWidth: 300
  },
  popupButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1rem'
  },
  cancelBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#ccc',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer'
  },
  logoutBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#d9534f',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer'
  },
  
  userInfo: {
    padding: '1rem',
    borderBottom: '1px solid #eee',
    textAlign: 'left',
    backgroundColor: '#f9f9f9',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
  },
  name: {
    fontWeight: '600',
    fontSize: '1rem',
    marginBottom: '0.25rem',
    color: '#333'
  },
  email: {
    fontSize: '0.9rem',
    color: '#666'
  },
  spinnerBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '1rem'
  }


};

export default UserMenu;
