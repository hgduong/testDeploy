import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import img1 from "../assets/img/bghome.png";
import productImg from "../assets/img/bghome.png"; // ảnh sản phẩm demo
import "../assets/styles/HomePage.css";

const HomePage = () => {
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const recoveryLogin = localStorage.getItem("isRecoveryLogin");
    if (recoveryLogin === "true") {
      setShowResetPopup(true);
    }
  }, []);

  const handleResetRedirect = () => {
    localStorage.removeItem("isRecoveryLogin");
    navigate("/reset-password");
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div className="home-page" style={{ backgroundImage: `url(${img1})` }}>
      <div className="overlay">
        <h1 className="title" style={{fontStyle:"-moz-initial"}}>Trà Hoa Vàng Tam Đảo</h1>
        <p className="subtitle">"Một tách trà - Một mảnh hồn Tam Đảo"</p>
        <div className="button-group">
          <a href="/products" className="btn primary">
            Mua ngay
          </a>
          <button
  className="btn primary"
  onClick={() => {
    document.getElementById('featured').scrollIntoView({ behavior: 'smooth' });
  }}
>
  Sản phẩm nổi bật
</button>

        </div>
        <a href="/contact" className="btn contact">
          Liên hệ
        </a>
      </div>

      {/* Sản phẩm nổi bật */}
      <section id="featured" className="featured">
        <h2>Sản phẩm nổi bật</h2>

        {/* SP1: Ảnh bên trái, chữ bên phải */}
        <div className="product-item product-item-1">
          <div className="product-image">
            <img src={productImg} alt="Trà Hoa Vàng" />
          </div>
          <div className="product-content">
            <h3>🌼 Hộp Trà Hoa Vàng</h3>
            <p>Tinh túy từ thiên nhiên, chăm sóc sức khỏe toàn diện. Được tuyển chọn từ những bông hoa vàng quý hiếm, trà hoa vàng nguyên bông mang đến hương vị thanh khiết và giá trị dược liệu cao.</p>
            <p><strong>✨ Công dụng:</strong> Hỗ trợ giải độc gan, làm mát cơ thể, cải thiện giấc ngủ, tăng cường sức đề kháng.</p>
            <button className="btn detail" onClick={openModal}>
              Xem chi tiết
            </button>
          </div>
        </div>

        {/* SP2: Chữ bên trái, ảnh bên phải */}
        <div className="product-item product-item-2">
          <div className="product-content">
            <h3>🌼 Trà Hoa Vàng Kết Hợp</h3>
            <p>Sự kết hợp hài hòa giữa hoa vàng quý hiếm và các vị thảo mộc tự nhiên. Lựa chọn lý tưởng để thanh lọc cơ thể, thư giãn tinh thần và tăng cường sức khỏe mỗi ngày.</p>
            <p><strong>✨ Công thức:</strong> Hoa vàng + cúc hoa + cam thảo | Hoa vàng + tâm sen + lá vông | Hoa vàng + gừng + mật ong</p>
            <button className="btn detail" onClick={openModal}>
              Xem chi tiết
            </button>
          </div>
          <div className="product-image">
            <img src={productImg} alt="Trà Hoa Vàng Kết Hợp" />
          </div>
        </div>

        {/* SP3: Ảnh bên trái, chữ bên phải */}
        <div className="product-item product-item-3">
          <div className="product-image">
            <img src={productImg} alt="Quà Tặng Sang Trọng" />
          </div>
          <div className="product-content">
            <h3>🎁 Quà Tặng Sang Trọng</h3>
            <p>Mang thông điệp yêu thương và sự quan tâm đến sức khỏe. Hộp quà tặng trà thảo mộc là lựa chọn tinh tế dành cho người thân, bạn bè, đồng nghiệp hay đối tác.</p>
            <p><strong>✨ Lý do chọn:</strong> Vẻ ngoài lịch sự, trang nhã, phù hợp nhiều dịp và đầy ý nghĩa. Không đơn thuần là lời chúc, mà là hành động cụ thể chăm sóc sức khỏe.</p>
            <button className="btn detail" onClick={openModal}>
              Xem chi tiết
            </button>
          </div>
        </div>
      </section>

      {/* Modal chi tiết sản phẩm */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Chi tiết sản phẩm</h3>
            <p>🌼 Trà Hoa Vàng Tam Đảo - tinh túy từ thiên nhiên.</p>
            <p>Công dụng: hỗ trợ giấc ngủ, tăng đề kháng, chống oxy hóa.</p>
            <button className="btn close" onClick={closeModal}>
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Popup reset mật khẩu */}
      {showResetPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>🔒 Bạn vừa đăng nhập bằng mật khẩu khôi phục</h3>
            <p>Vui lòng đổi mật khẩu mới để tiếp tục sử dụng hệ thống.</p>
            <button className="btn primary" onClick={handleResetRedirect}>
              Đổi mật khẩu ngay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
