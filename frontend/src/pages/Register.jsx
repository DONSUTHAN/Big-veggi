import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../services/api.js";

const dashboardPath = {
  customer: "/customer",
  farmer: "/farmer"
};

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    phone: "",
    address: ""
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const updateForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      const user = await register(form);
      navigate(dashboardPath[user.role] || "/");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-panel wide" onSubmit={handleSubmit}>
        <span className="eyebrow">Create account</span>
        <h1>Register</h1>
        {error && <p className="alert error">{error}</p>}
        <div className="form-grid two">
          <label>
            Name
            <input name="name" value={form.name} onChange={updateForm} required />
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={updateForm} required />
          </label>
          <label>
            Password
            <input name="password" type="password" value={form.password} onChange={updateForm} required minLength="6" />
          </label>
          <label>
            Register as
            <select name="role" value={form.role} onChange={updateForm}>
              <option value="customer">Customer</option>
              <option value="farmer">Farmer</option>
            </select>
          </label>
          <label>
            Phone
            <input name="phone" value={form.phone} onChange={updateForm} />
          </label>
          <label>
            Address
            <input name="address" value={form.address} onChange={updateForm} />
          </label>
        </div>
        <button className="primary-button full-button" type="submit" disabled={saving}>
          <UserPlus size={18} />
          {saving ? "Creating..." : "Register"}
        </button>
        <p className="auth-switch">
          Already registered? <Link to="/login">Login here</Link>
        </p>
      </form>
    </main>
  );
}
