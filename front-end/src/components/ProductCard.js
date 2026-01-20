import React from "react";

function ProductCard({ product, onAddToCart, onBuyNow }) {
  return (
    <>
      <div style={styles.card}>
        <h4>{product.name}</h4>
      <img src={product.image} alt={product.name} style={styles.image} />
      <p>{product.price} VND</p>
      <div style={styles.actions}>
        <button style={styles.btnDetail} onClick={() => onAddToCart(product)}>
          Xem chi tiết
        </button>
        <button style={styles.btnAdd} onClick={() => onAddToCart(product)}>
          Thêm vào giỏ hàng
        </button>
        <button style={styles.btnBuy} onClick={() => onBuyNow(product)}>
          Mua ngay
        </button>
      </div>
    </div>
    
    
    </>
    // đặt hàng
  );
}

const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "16px",
    width: "300px",
    textAlign: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    margin: "10px",
    
  },
  image: {
    width: "100%",
    height: "230px",
    objectFit: "cover",
    borderRadius: "6px",
  },
  actions: {
    marginTop: "12px",
    display: "flex",
    justifyContent: "space-between",
    gap: "8px",
  },
  btnAdd: {
    backgroundColor: "#f0c14b",
    border: "1px solid #a88734",
    padding: "8px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  btnBuy: {
    backgroundColor: "#13db4fff",
    border: "1px solid #a88734",
    padding: "8px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  btnDetail: {
    backgroundColor: "#6becdbff",
    border: "1px solid #a88734",
    padding: "8px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default ProductCard;
