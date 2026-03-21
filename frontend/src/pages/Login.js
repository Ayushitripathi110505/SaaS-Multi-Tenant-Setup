import React, { useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password
      });

      login(res.data);          // store user + token
      navigate("/dashboard");   // redirect

    } catch (err) {
  console.log(err.response);
  console.log(err.response?.data);
  alert(err.response?.data?.error || "Login failed");
}
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <input
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />

      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />

      <button type="submit">Login</button>
    </form>
  );
}

export default Login;