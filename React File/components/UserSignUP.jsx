import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/a.css";

const UserSignUp = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER", // default role
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Force role to USER for this signup
      await axios.post("http://localhost:8081/api/users/signup", {
        ...user,
        role: "USER",
      });
      alert("Signup successful! Please login.");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error: Email may already exist.");
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

      <h2>Create Account</h2>
      <form onSubmit={handleSignup} style={{ width: "100%" }}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={user.name}
          onChange={handleChange}
          required
        />
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
          placeholder="Create Password"
          value={user.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <a href="/">Login</a>
      </p>
    </div>
  );
};

export default UserSignUp;
