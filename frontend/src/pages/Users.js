import React, { useEffect, useState } from "react";
import API from "../api/api";

function Users() {
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Employee",
  });

  // =========================
  // Fetch Users
  // =========================
  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================
  // Handle Input
  // =========================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =========================
  // Create User
  // =========================
  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      await API.post("/users", form);
      setForm({
        name: "",
        email: "",
        password: "",
        role: "Employee",
      });
      fetchUsers();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // =========================
  // Update Role
  // =========================
  const handleRoleChange = async (userId, newRole) => {
    try {
      await API.put(`/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // =========================
  // Delete User
  // =========================
  const handleDelete = async (userId) => {
    try {
      await API.delete(`/users/${userId}`);
      fetchUsers();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div>
      <h2>👥 Users Management</h2>

      {/* ================= CREATE USER ================= */}
      <h3>Create User</h3>

      <form onSubmit={handleCreateUser}>
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
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <br />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
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

        <button type="submit">Create</button>
      </form>

      <hr />

      {/* ================= USERS LIST ================= */}
      <h3>All Users</h3>

      {users.map((u) => (
        <div
          key={u._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <p><strong>{u.name}</strong></p>
          <p>{u.email}</p>

          <p>Role: {u.role}</p>

          {/* Change Role */}
          <select
            value={u.role}
            onChange={(e) =>
              handleRoleChange(u._id, e.target.value)
            }
          >
            <option value="Employee">Employee</option>
            <option value="Manager">Manager</option>
            <option value="Admin">Admin</option>
          </select>

          <br /><br />

          {/* Delete */}
          <button onClick={() => handleDelete(u._id)}>
            Delete ❌
          </button>
        </div>
      ))}
    </div>
  );
}

export default Users;