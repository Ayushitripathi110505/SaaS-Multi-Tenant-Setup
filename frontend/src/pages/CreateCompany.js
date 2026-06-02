import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function CreateCompany() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: "",
    companyPlan: "Basic",
    name: "",
    email: "",
    password: "",
    adminKey: "",
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
      const res = await API.post("/auth/create-company", form);

      alert("Company created! Code: " + res.data.companyCode);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Company creation failed");
    }
  };

  return (
    <div>
      <h2>Create Company</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="companyName"
          placeholder="Company Name"
          value={form.companyName}
          onChange={handleChange}
          required
        />

        <select
          name="companyPlan"
          value={form.companyPlan}
          onChange={handleChange}
        >
          <option value="Basic">Basic</option>
          <option value="Standard">Standard</option>
          <option value="Premium">Premium</option>
        </select>

        <input
          name="name"
          placeholder="Admin Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <input
          name="adminKey"
          placeholder="Admin Key"
          value={form.adminKey}
          onChange={handleChange}
          required
        />

        <button type="submit">Create Company</button>
      </form>
    </div>
  );
}

export default CreateCompany;