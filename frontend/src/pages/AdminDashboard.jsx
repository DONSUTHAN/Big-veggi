import React, { useEffect, useState } from "react";
import { ShieldCheck, Trash2 } from "lucide-react";
import { adminService } from "../services/adminService.js";
import { orderService } from "../services/orderService.js";
import { getErrorMessage } from "../services/api.js";
import { formatRupees } from "../utils/format.js";

const statuses = ["Pending", "Accepted", "Packed", "Delivered", "Cancelled"];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const loadData = async () => {
    const [dashboardData, usersData, ordersData] = await Promise.all([
      adminService.dashboard(),
      adminService.users(),
      orderService.all()
    ]);
    setStats(dashboardData);
    setUsers(usersData);
    setOrders(ordersData);
  };

  useEffect(() => {
    loadData().catch((err) => setError(getErrorMessage(err)));
  }, []);

  const updateRole = async (id, role) => {
    await adminService.updateRole(id, role);
    await loadData();
  };

  const deleteUser = async (id) => {
    await adminService.deleteUser(id);
    await loadData();
  };

  const updateStatus = async (id, status) => {
    await orderService.updateStatus(id, status);
    await loadData();
  };

  return (
    <main className="page-shell dashboard-shell">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Admin</span>
          <h1>All Controls</h1>
        </div>
      </div>

      {error && <p className="alert error">{error}</p>}

      <section className="stat-grid">
        {stats &&
          [
            ["Users", stats.users],
            ["Farmers", stats.farmers],
            ["Customers", stats.customers],
            ["Products", stats.products],
            ["Orders", stats.orders],
            ["Sales", formatRupees(stats.sales)]
          ].map(([label, value]) => (
            <div className="stat-card" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
      </section>

      <section className="panel full-panel">
        <h2>
          <ShieldCheck size={20} />
          Users
        </h2>
        <div className="table-list">
          {users.map((user) => (
            <div className="table-row admin-row" key={user._id}>
              <span>{user.name}</span>
              <span>{user.email}</span>
              <select value={user.role} onChange={(event) => updateRole(user._id, event.target.value)}>
                <option value="customer">customer</option>
                <option value="farmer">farmer</option>
                <option value="admin">admin</option>
              </select>
              <button className="icon-button danger" type="button" onClick={() => deleteUser(user._id)}>
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="panel full-panel">
        <h2>Orders</h2>
        <div className="table-list">
          {orders.map((order) => (
            <div className="table-row admin-row" key={order._id}>
              <span>{order.customer?.name}</span>
              <span>{order.products.map((item) => item.product?.name).join(", ")}</span>
              <strong>{formatRupees(order.totalPrice)}</strong>
              <select value={order.status} onChange={(event) => updateStatus(order._id, event.target.value)}>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
