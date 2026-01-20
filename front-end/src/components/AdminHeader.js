import React from "react";
import "./AdminHeader.css"
const AdminHeader = () => {
  return (
    <header className="header">
      {" "}
      <div className="header__left">
        {" "}
        <div className="logo">Admin Panel</div>{" "}
      </div>{" "}
      <div className="header__right">
        {" "}
        <input className="search" placeholder="Tìm kiếm..." />{" "}
        <button className="btn">Tải báo cáo</button>{" "}
        <div className="avatar">A</div>{" "}
      </div>{" "}
    </header>
  );
};

export default AdminHeader;
