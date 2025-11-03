
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
      <div className="container-fluid ">
        {/* Brand / Logo */}
        {/* <a
          className="navbar-brand"
          href="#!"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          MyWebsite
        </a> */}
        <button className="navbar-brand btn text-white" onClick={() => navigate("/")}>
  MyWebsite
</button>


        {/* Toggle button for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <button
                className="btn nav-link text-white"
                onClick={() => navigate("/")}
              >
                Home
              </button>
            </li>

            {isLoggedIn && (
              <li className="nav-item">
                <button
                  className="btn nav-link text-white"
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </button>
              </li>
            )}

            {isLoggedIn ? (
              <li className="nav-item">
                <button className="btn nav-link text-white" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <button
                  className="btn nav-link text-white"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
