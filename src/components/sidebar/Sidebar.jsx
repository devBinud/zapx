import React from 'react';
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/image/logo.png"

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const toggleSidebar = () => {
    const expandedClass = "layout-menu-expanded";
    const menu = document.getElementById("layout-menu");

    if (document.body.classList.contains(expandedClass)) {
      document.body.classList.remove(expandedClass);
      if (menu) {
        menu.classList.remove("d-block");
        menu.classList.add("d-none");
      }
    } else {
      document.body.classList.add(expandedClass);
      if (menu) {
        menu.classList.remove("d-none");
        menu.classList.add("d-block");
      }
    }

  }
  return (
    <div>
      <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
        <div className="app-brand demo">
        <Link to="/" className="app-brand-link">
  <span className="app-brand-logo demo">
    <img src={logo} alt="ZapX Logo" height="70" />
  </span>
  {/* <span className="app-brand-text demo menu-text fw-bolder ms-2">ZapX</span> */}
</Link>

          <button
  type="button"
  className="layout-menu-toggle d-block d-xl-none border-0"
  onClick={toggleSidebar}
  style={{
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1051,
  }}
>
  <i className="bx bx-x fs-4"></i>
</button>




        </div>

        <div className="menu-inner-shadow"></div>

        <ul className="menu-inner py-1">
          <li className={`menu-item ${currentPath === '/' ? 'active' : ''}`}>
            <Link to="/" className="menu-link">
              <i className="menu-icon tf-icons bx bx-home-circle"></i>
              <div>Dashboard</div>
            </Link>
          </li>

          <li className={`menu-item ${currentPath === '/add-product' ? 'active' : ''}`}>
            <Link to="/add-product" className="menu-link">
              <i className="menu-icon tf-icons bx bx-plus-circle"></i>
              <div>Add New Product</div>
            </Link>
          </li>

          <li className={`menu-item ${currentPath === '/all-products' ? 'active' : ''}`}>
            <Link to="/all-products" className="menu-link">
              <i className="menu-icon tf-icons bx bx-grid-alt"></i>
              <div>All Products</div>
            </Link>
          </li>

          <li className={`menu-item ${currentPath === '/quick-sale' ? 'active' : ''}`}>
            <Link to="/quick-sale" className="menu-link">
              <i className="menu-icon tf-icons bx bx-cart"></i>
              <div>Product Sale</div>
            </Link>
          </li>

          <li className={`menu-item ${currentPath === '/bill-generate' ? 'active' : ''}`}>
            <Link to="/bill-generate" className="menu-link">
              <i className="menu-icon tf-icons bx bx-receipt"></i>
              <div>Bill Generate</div>
            </Link>
          </li>

          <li className={`menu-item ${currentPath === '/whatsapp-share' ? 'active' : ''}`}>
            <Link to="/share-product" className="menu-link">
              <i className="menu-icon tf-icons bx bxl-whatsapp"></i>
              <div>Whatsapp Share</div>
            </Link>
          </li>

          <li className={`menu-item ${currentPath === '/sales-report' ? 'active' : ''}`}>
            <Link to="/sales-report" className="menu-link">
              <i className="menu-icon tf-icons bx bx-bar-chart-alt-2"></i>
              <div>Sales Report</div>
            </Link>
          </li>
        </ul>
      </aside>

      {/* <!-- Overlay --> */}
     
    </div>
  );
};

export default Sidebar;
