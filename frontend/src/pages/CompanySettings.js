import React, { useEffect, useState } from "react";
import API from "../api/api";

function CompanySettings() {
  const [form, setForm] = useState({
    companyName: "",
    companyPlan: "Basic",
    companyCode: "",
  });

  const fetchCompany = async () => {
    try {
      const res = await API.get("/company/me");

      setForm({
        companyName: res.data.companyName,
        companyPlan: res.data.companyPlan,
        companyCode: res.data.companyCode,
      });
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await API.put("/company/me", {
        companyName: form.companyName,
        companyPlan: form.companyPlan,
      });

      alert("Company settings updated");
      fetchCompany();
    } catch (err) {
      alert(err.response?.data?.error || "Update failed");
    }
  };

  return (
    <div>
      <h2>🏢 Company Settings</h2>

      <form onSubmit={handleUpdate}>
        <input
          name="companyName"
          placeholder="Company Name"
          value={form.companyName}
          onChange={handleChange}
          required
        />

        <br />

        <select
          name="companyPlan"
          value={form.companyPlan}
          onChange={handleChange}
        >
          <option value="Basic">Basic</option>
          <option value="Standard">Standard</option>
          <option value="Premium">Premium</option>
        </select>

        <br />

        <input
          value={form.companyCode}
          readOnly
          placeholder="Company Code"
        />

        <br />

        <button type="submit">Update Company</button>
      </form>
    </div>
  );
}

export default CompanySettings;