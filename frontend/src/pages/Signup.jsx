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
    adminKey: "",
    companyCode: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <br />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <br />

        <input
          type="text"
          name="companyCode"
          value={form.companyCode}
          placeholder="Company Code"
          onChange={handleChange}
          required
        />
        <br />

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="Employee">Employee</option>
          <option value="Manager">Manager</option>
          <option value="Admin">Admin</option>
        </select>
        <br />

        {form.role === "Admin" && (
          <>
            <input
              name="adminKey"
              placeholder="Enter Admin Secret Key"
              value={form.adminKey}
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