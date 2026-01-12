import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
//import "./Auth.css";
import "./css/signup.css";


const Signup = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "", // default role
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8081/api/users/signup", user);
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

      <h2>Create User</h2>
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

        {/* 🔹 Role dropdown (Admin/User) */}
        <select
         name="role"
          value={user.role}
          onChange={handleChange}
          style={{ marginBottom: "10px", padding: "8px", width: "100%" }}>
            <option value="USER">User</option>
            <option value="VERIFICATION">Verification Officer</option>
            <option value="MANAGER">Manager Approval</option>
            <option value="SERVICE_MANAGER">External Service Manager</option>
            <option value="ADMIN">Admin</option>
        </select>


        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default Signup;
