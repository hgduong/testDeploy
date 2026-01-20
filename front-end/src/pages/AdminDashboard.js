import React from "react";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import "../components/AdminDashboard.css"; 

const AdminDashboard = () => {
  return (
    <div className="admin-layout">
      <AdminHeader />
      <div className="admin-body">
        <AdminSidebar />
        <main className="dashboard">
          <section className="welcome">
            <h2>Chào mừng trở lại, Admin</h2>
            <p className="date">Ngày tháng: 17 Aug 2025</p>
          </section>

          <section className="stats">
            <div className="card">
              <span className="label">Đơn hàng</span>
              <span className="value">525 đơn hàng</span>
            </div>
            <div className="card">
              <span className="label">Đã bán</span>
              <span className="value">1636 sản phẩm</span>
            </div>
            <div className="card">
              <span className="label">Khoản chi</span>
              <span className="value">36.01M VND</span>
            </div>
            <div className="card">
              <span className="label">Doanh thu</span>
              <span className="value">63.87M VND</span>
            </div>
          </section>

          <section className="charts">
            <div className="panel">
              <h3>Doanh thu</h3>
              <div className="chart-placeholder">Line chart</div>
            </div>
            <div className="panel">
              <h3>Sản phẩm bán chạy</h3>
              <div className="chart-placeholder">Bar chart</div>
            </div>
            <div className="panel">
              <h3>Phương thức thanh toán</h3>
              <div className="chart-placeholder">Pie chart</div>
            </div>
          </section>

          {/* <div className="actions">
            <button className="btn-primary">Tải báo cáo</button>
          </div> */}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
