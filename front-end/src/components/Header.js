import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserMenu from './UserMenu';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const updateLoginState = () => setIsLoggedIn(!!localStorage.getItem('token'));
    window.addEventListener('storage', updateLoginState);
    window.addEventListener('userUpdated', updateLoginState);
    return () => {
      window.removeEventListener('storage', updateLoginState);
      window.removeEventListener('userUpdated', updateLoginState);
    };
  }, []);

  return (
    <header className="site-header" style={styles.header}>
      {/* Logo bên trái */}
      <div style={styles.logoContainer}>
        <img className="site-logo" src="/img/homepage/trahoavang_logo.png" alt="Logo" style={styles.logo} onClick={() => window.location.href = "/"} />
      </div>

      {/* Menu + Avatar/Login bên phải */}
      <div style={styles.rightSection}>
        <nav className="site-nav" style={styles.nav}>
          <Link to="/" className="nav-link" style={styles.link}>Trang chủ</Link>
          <Link to="/products" className="nav-link" style={styles.link}>Sản phẩm</Link>
          <Link to="/about" className="nav-link" style={styles.link}>Về chúng tôi</Link>
          <Link to="/cart" className="nav-link" style={styles.link}>Giỏ hàng</Link>
        </nav>
        <div style={styles.userSection}>
          {isLoggedIn ? (
            <UserMenu />
          ) : (
            <Link to="/login" className="nav-link" style={styles.loginText}>Đăng nhập</Link>
          )}
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 2rem',
    height: 64,
    backgroundColor: '#111',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    overflow: 'visible'
  },
  logoContainer: { flex: '0 0 auto' },
  logo: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  rightSection: {
    position: 'relative',
    zIndex: 2000,// để dropdown bám vào đúng cha 
    overflow: 'visible', // không cắt dropdown
    display: 'flex',
    alignItems: 'center',
    gap: '2rem'
  },
  nav: {
    display: 'flex',
    gap: '2rem'
  },
  link: {
    textDecoration: 'none',
    color: '#fff',
    fontWeight: '500'
  },
  userSection: { flex: '0 0 auto' },
  loginText: {
    marginRight: '4rem',
    textDecoration: 'none',
    color: 'yellow',
    fontWeight: '500'
  },
  
};

export default Header;
