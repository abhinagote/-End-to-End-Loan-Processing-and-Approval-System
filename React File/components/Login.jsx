import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
//import "./Auth.css";
import "./css/a.css";

const Login = ({ setIsAuthenticated }) => {
  const [user, setUser] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8081/api/users/login", user);

      // ✅ Save user details (id, name, role)
      localStorage.setItem("userId", res.data.id);
      localStorage.setItem("userName", res.data.name);
      localStorage.setItem("role", res.data.role); // 🔹 store role for RBAC

      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid credentials!");
    }
  };

  return (
    <div className="auth-card">
      {/* 🔹 EbixCash Logo at Top */}
      <img
        src="https://d3lzcn6mbbadaf.cloudfront.net/media/details/ANI-20240403050710.jpg"
        alt="EbixCash Logo"
        className="auth-logo"
      />

      <h2>User Login</h2>
      <form onSubmit={handleLogin} style={{ width: "100%" }}>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={user.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don’t have an account? <Link to="/Usersignup">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;
