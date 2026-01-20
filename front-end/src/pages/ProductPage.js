import React from "react";
import ProductCard from "../components/ProductCard";
import sp1 from '../assets/img/sp1.png';

const products = [
  { name: "Hộp 500 gram", price: "100.000", image: sp1 },
  { name: "Hộp 1 kg", price: "200.000", image: sp1 },
  { name: "Hộp 1 kg", price: "200.000", image: sp1 },
  { name: "Hộp 1 kg", price: "200.000", image: sp1 },
  { name: "Hộp 500 gram", price: "100.000", image: sp1 },
  { name: "Hộp 1 kg", price: "200.000", image: sp1 },
  { name: "Hộp 1 kg", price: "200.000", image: sp1 },
  { name: "Hộp 1 kg", price: "200.000", image: sp1 },
];

const handleAddToCart = (item) => {
  alert(`Đã thêm ${item.name} vào giỏ hàng!`);
};

const handleBuyNow = (item) => {
  alert(`Mua ngay sản phẩm: ${item.name}`);
};

const ProductPage = () => {
  return (
    <>
    <div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h2>Sản phẩm trà hoa vàng Tam Đảo</h2>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 0.1fr)", // 4 cột
          gap: "5px",
          justifyContent: "center",
          
        }}
      >
        {products.map((product, index) => (
          <ProductCard
            key={index}
            product={product}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        ))}
      </div>
    </div>

    <div style={{ display: "flex", marginTop: "20px" }}>
  {/* Cột trái: Form */}
  <div style={{ flex: 1, marginRight: "20px", marginLeft: "310px" }}>
    <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Đặt sản phẩm riêng</h2>
    <form>
      <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
        <label>Tên sản phẩm:</label>
        <input type="text" name="productName" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
        <label>Số lượng:</label>
        <input type="number" name="quantity" min="1" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
        <label>Số điện thoại:</label>
        <input type="number" name="phoneNumber" min="1" placeholder="Ví dụ: 0123456789" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
        <label>Mail:</label>
        <input type="email" name="email" placeholder="Ví dụ: abc@example.com"/>
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
        <label>Địa chỉ nhận hàng:</label>
        <input type="text" name="address" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
        <label>Mô tả thêm (nếu có):</label>
        <textarea type="text" name="description" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
        <label>Yêu cầu:</label>
        <textarea type="text" name="requirement" />
      </div>
      <p style={{ marginTop: "10px",color: "red" }}>
        *Khách hàng cần điền thông tin đầy đủ và chính xác để chúng tôi liên hệ xác nhận đơn hàng.
      </p>
      <button
        type="submit"
        style={{
          marginTop: "10px",
          marginBottom: "20px",
          padding: "10px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginLeft: "150px",
        }}
      >
        Đặt hàng
      </button>
    </form>
  </div>

  {/* Cột phải: Liên hệ */}
  <div style={{ flex: 1, marginLeft: "5px", marginRight: "250px", marginTop: "200px", textAlign: "center" }}>
    <h2>Liên hệ với chúng tôi</h2>
    <p>📍 Địa chỉ: 123 Đường Lê Lợi, Tam Đảo, Vĩnh Phúc</p>
    <p>📞 Số điện thoại: 0123 456 789</p>
    <p>💬 Zalo: 0123 456 789</p>
  </div>
</div>

    
    </>
  );
};

export default ProductPage;
