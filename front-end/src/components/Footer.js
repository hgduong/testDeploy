import React from 'react';

const Footer = () => {
  return (
    <footer className="site-footer" style={styles.footer}>
      <div style={styles.container}>
        <div>© {new Date().getFullYear()} Trà Hoa Vàng Tam Đảo</div>
        <div style={styles.links}>
          <a href="/about" style={styles.link}>Về chúng tôi</a>
          <a href="/contact" style={styles.link}>Liên hệ</a>
          <a href="/policy" style={styles.link}>Chính sách</a>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    width: '100%',
    backgroundColor: '#222',
    color: '#fff',
    padding: '1rem 2rem',
    position: 'relative'
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  links: {
    display: 'flex',
    gap: '1rem'
  },
  link: {
    color: '#ddd',
    textDecoration: 'none'
  }
};

export default Footer;
