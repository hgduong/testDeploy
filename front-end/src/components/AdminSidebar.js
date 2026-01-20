import './AdminSidebar.css';

const menu = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'products', label: 'Quản lý sản phẩm' },
  { key: 'orders', label: 'Quản lý đơn hàng' },
  { key: 'customers', label: 'Quản lý khách hàng' },
  { key: 'reports', label: 'Thống kê báo cáo' },
  { key: 'promotions', label: 'Khuyến mãi' },
  { key: 'users', label: 'Người dùng & quyền' },
  { key: 'settings', label: 'Cài đặt' },
];

export default function Sider() {
  return (
    <aside className="sider">
      <div className="sider__header">
        <div className="sider__logo">🛒</div>
        <span className="sider__title">Menu</span>
      </div>
      <ul className="sider__menu">
        {menu.map(item => (
          <li key={item.key} className="sider__item">
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
