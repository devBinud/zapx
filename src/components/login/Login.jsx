import React, { useState } from 'react';
import "../login/Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === 'admin' && password === 'iconnect@2025Admin') {
      localStorage.setItem('userToken', 'authenticated');
      window.location.href = '/';
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card" style={{ width: "100%", maxWidth: "420px" }}>
        <div className="card-body">
          {/* Logo */}
          <div className="app-brand justify-content-center d-flex mb-3">
            <span className="app-brand-text demo text-body fw-bolder fs-3">StorePlex</span>
          </div>
          {/* /Logo */}

          <h4 className="mb-2">Welcome! 👋</h4>
          <p className="mb-4">Please sign in to your account</p>

          {error && <p className="text-danger">{error}</p>}

          <form onSubmit={handleLogin} className="mb-3">
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Email or Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="input-group-text cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: 'pointer' }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="mb-3 form-check">
              <input type="checkbox" className="form-check-input" id="rememberMe" />
              <label className="form-check-label" htmlFor="rememberMe">Remember Me</label>
            </div>

            <button className="btn btn-primary d-grid w-100" type="submit">Sign in</button>
          </form>

          <p className="text-center">
            <span>New on our platform?</span>{" "}
            <a href="#">Create an account</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
