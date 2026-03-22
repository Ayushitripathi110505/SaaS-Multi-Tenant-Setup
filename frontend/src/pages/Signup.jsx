import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Employee",
    companyId: "",
    adminKey: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", form);
      alert("Signup successful");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Signup</h2>

      <form onSubmit={handleSubmit}>

        <input name="name" placeholder="Name" onChange={handleChange} />
        <br />

        <input name="email" placeholder="Email" onChange={handleChange} />
        <br />

        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <br />

        <input name="companyId" placeholder="Company ID" onChange={handleChange} />
        <br />

        {/* Role Selection */}
        <select name="role" onChange={handleChange}>
          <option value="Employee">Employee</option>
          <option value="Manager">Manager</option>
          <option value="Admin">Admin</option>
        </select>
        <br />

        {/* 🔐 Show only if Admin selected */}
        {form.role === "Admin" && (
          <>
            <input
              name="adminKey"
              placeholder="Enter Admin Secret Key"
              onChange={handleChange}
            />
            <br />
          </>
        )}

        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;