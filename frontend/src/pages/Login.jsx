import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../services/api.js";

const dashboardPath = {
  customer: "/customer",
  farmer: "/farmer",
  admin: "/admin"
};

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const updateForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      const user = await login(form);
      navigate(dashboardPath[user.role] || "/");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-panel" onSubmit={handleSubmit}>
        <span className="eyebrow">Welcome back</span>
        <h1>Login</h1>
        {error && <p className="alert error">{error}</p>}
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={updateForm} required />
        </label>
        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={updateForm} required />
        </label>
        <button className="primary-button full-button" type="submit" disabled={saving}>
          <LogIn size={18} />
          {saving ? "Logging in..." : "Login"}
        </button>
        <p className="auth-switch">
          If no register, <Link to="/register">click here to register</Link>
        </p>
      </form>
    </main>
  );
}
