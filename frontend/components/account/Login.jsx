
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [account, setAccount] = useState("login");
  const [signup, setSignup] = useState({
    name: "",
    username: "",
    password: "",
    email: "",
  });
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const onInputChange = (e) => {
    setSignup({ ...signup, [e.target.name]: e.target.value });
  };
  const onLoginChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const signupUser = async (e) => {
    e.preventDefault();
    if (!signup.name || !signup.username || !signup.password || !signup.email) {
      toast.error("Please fill all the fields", { position: "top-right" });
      return;
    }
    try {
      const res = await axios.post("https://blog-app1-87fg.onrender.com/register", signup);
      toast.success(res.data.message || "Registered successfully", {
        position: "top-right",
      });
      setTimeout(() => setAccount("login"), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
      });
    }
  };

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://blog-app1-87fg.onrender.com/login", data);
      localStorage.setItem("token", res.data.token);
      toast.success(res.data.message || "Login successful", {
        position: "top-right",
      });
      setTimeout(() => navigate("/profile"), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <div className="text-center mb-3">
          <img
            src="https://tse3.mm.bing.net/th/id/OIP.CfAPa2jcb7hwMg7f2GKwmwHaHa?pid=Api&P=0&h=180"
            alt="logo"
            style={{ width: "100px", borderRadius: "50%" }}
          />
        </div>

        {account === "login" ? (
          <form onSubmit={loginUser}>
            <h4 className="text-center mb-3">Login</h4>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={data.email || ""}
                onChange={onLoginChange}
                placeholder="Enter email"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={data.password || ""}
                onChange={onLoginChange}
                placeholder="Enter password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>

            <p className="text-center mt-3 mb-0">
              Don’t have an account?{" "}
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={() => setAccount("signup")}
              >
                Sign Up
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={signupUser}>
            <h4 className="text-center mb-3">Sign Up</h4>

            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={signup.name}
                onChange={onInputChange}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={signup.email}
                onChange={onInputChange}
                placeholder="Enter email"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                name="username"
                value={signup.username}
                onChange={onInputChange}
                placeholder="Enter username"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={signup.password}
                onChange={onInputChange}
                placeholder="Enter password"
                required
              />
            </div>

            <button type="submit" className="btn btn-success w-100">
              Sign Up
            </button>

            <p className="text-center mt-3 mb-0">
              Already have an account?{" "}
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={() => setAccount("login")}
              >
                Login
              </button>
            </p>
          </form>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;

