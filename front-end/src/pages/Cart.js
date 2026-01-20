import React from "react";
import "../components/Cart.css";

const Cart = () => {
  const products = Array(5).fill({
    name: "Túi lọc trà",
    price: 16000,
    quantity: 30,
    total: 480000,
  });

  const totalAmount = products.reduce((sum, p) => sum + p.total, 0);

  return (
    <div className="cart">
      <h2>Giỏ hàng</h2>

      <table className="cart-table">
        <thead>
          <tr>
            <th>Chọn tất cả</th>
            <th>Sản phẩm</th>
            <th>Đơn giá</th>
            <th>Số lượng</th>
            <th>Số tiền</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, index) => (
            <tr key={index}>
              <td><input type="checkbox" /></td>
              <td>{p.name}</td>
              <td>{p.price.toLocaleString()} VND</td>
              <td>{p.quantity}</td>
              <td>{p.total.toLocaleString()} VND</td>
              <td><button className="action-btn">Xóa</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="summary">
        <p><strong>Tổng cộng:</strong></p>
        <p>Số sản phẩm: {products.length}</p>
        <p>Số tiền: {totalAmount.toLocaleString()} VND</p>
        <button className="order-btn">Đặt hàng</button>
      </div>

      <div className="address">
        <h4>Địa chỉ:</h4>
        <p>nhà 1, xóm 2, thôn A, xã B, tỉnh C</p>
      </div>

      <div className="payment">
        <h4>Phương thức thanh toán:</h4>
        <label>
          <input type="radio" name="payment" />
          Thanh toán chuyển khoản
        </label>
        <label>
          <input type="radio" name="payment" />
          Trả tiền khi nhận hàng (cọc trước 50% áp dụng cho đơn hàng &gt; 5.000.000)
        </label>
      </div>
    </div>
  );
};

export default Cart;
