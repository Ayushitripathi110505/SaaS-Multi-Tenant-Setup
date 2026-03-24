import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function CreateCompany() {
  const [form, setForm] = useState({
    companyName: "",
    companyPlan: "Basic",
    name: "",
    email: "",
    password: "",
    adminKey: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/create-company", form);
      alert("Company created! Code: " + res.data.companyCode);
    } catch (err) {
      alert(err.response?.data?.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="companyName" placeholder="Company Name" onChange={handleChange} />
      
      <select name="companyPlan" onChange={handleChange}>
        <option value="Basic">Basic</option>
        <option value="Standard">Standard</option>
        <option value="Premium">Premium</option>
      </select>

      <input name="name" placeholder="Admin Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} />

      <input name="adminKey" placeholder="Admin Key" onChange={handleChange} />

      <button type="submit">Create Company</button>
    </form>
  );
}
export default CreateCompany;