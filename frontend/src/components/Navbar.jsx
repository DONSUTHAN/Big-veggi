import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Home, LayoutDashboard, LogIn, LogOut, ShoppingBasket, Tractor, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import "./Navbar.css";

const dashboardPath = {
  customer: "/customer",
  farmer: "/farmer",
  admin: "/admin"
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <Link className="brand" to="/">
        <span className="brand-mark">B</span>
        <span>Big-veggi</span>
      </Link>

      <nav className="nav-center" aria-label="Main navigation">
        <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
          <Home size={17} />
          Home
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => (isActive ? "active" : "")}>
          <ShoppingBasket size={17} />
          Products
        </NavLink>
        {user && (
          <NavLink to={dashboardPath[user.role]} className={({ isActive }) => (isActive ? "active" : "")}>
            <LayoutDashboard size={17} />
            Dashboard
          </NavLink>
        )}
      </nav>

      <div className="nav-right">
        {!user ? (
          <>
            <Link className="nav-action" to="/login">
              <LogIn size={17} />
              Login
            </Link>
            <Link className="nav-action register-link" to="/register">
              <UserPlus size={17} />
              Register
            </Link>
          </>
        ) : (
          <>
            <span className="user-chip">{user.role}</span>
            <button className="nav-action" type="button" onClick={handleLogout}>
              <LogOut size={17} />
              Logout
            </button>
          </>
        )}

        <div className="tractor-logo" title="Big-veggi tractor logo">
          <Tractor size={26} />
        </div>
      </div>
    </header>
  );
}
