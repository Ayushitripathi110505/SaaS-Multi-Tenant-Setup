import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function Start() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Welcome</h2>

      <button onClick={() => navigate("/login")}>
        Join Company
      </button>

      <button onClick={() => navigate("/create-company")}>
        Create Company
      </button>
    </div>
  );
}
export default Start;