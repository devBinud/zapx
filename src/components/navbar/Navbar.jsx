import React, { useState } from 'react';
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/image/logo.png"

const Navbar = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

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
  };



  return (
    <div className="layout-page">
      <nav className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
        <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
          <button className="nav-item nav-link px-0 me-xl-4 border-0 bg-transparent" onClick={toggleSidebar}>
            <i className="bx bx-menu bx-sm" />
          </button>
        </div>

        <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
          <div className="navbar-nav align-items-center">
            <div className="nav-item d-flex align-items-center d-lg-none">
              <img
                src={logo}
                alt="ZapX Logo"
                style={{ height: '51px', width: 'auto' }}
                className="me-2"
              />
            </div>
          </div>

          <ul className="navbar-nav flex-row align-items-center ms-auto">
            <li className="nav-item navbar-dropdown dropdown-user dropdown">
              <a className="nav-link dropdown-toggle hide-arrow" href="#" onClick={(e) => e.preventDefault()} data-bs-toggle="dropdown">

                <div className="avatar avatar-online">
                  <img src="../assets/img/avatars/2.jpg" alt="" className="w-px-40 h-auto rounded-circle" />
                </div>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <a className="dropdown-item" href="#!">
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar avatar-online">
                          <img src="../assets/img/avatars/2.jpg" alt="" className="w-px-40 h-auto rounded-circle" />
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <span className="fw-semibold d-block mt-2">Admin</span>
                      </div>
                    </div>
                  </a>
                </li>
                <li><div className="dropdown-divider" /></li>
                <li>
                  <a className="dropdown-item" href="https://binud.vercel.app" target="_blank" rel="noopener noreferrer">
                    <i className="bx bx-user me-2" />
                    <span className="align-middle">My Profile</span>
                  </a>

                </li>
                <li><div className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item border-0 bg-transparent" onClick={handleLogout}>
                    <i className="bx bx-power-off me-2" />
                    <span className="align-middle">Log Out</span>
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>

      <div
        className="layout-overlay layout-menu-toggle"
        onClick={toggleSidebar}
      />
    </div>
  );
}

export default Navbar;
