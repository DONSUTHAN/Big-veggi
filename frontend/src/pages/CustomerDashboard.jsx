import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CreditCard, IndianRupee, ShoppingCart } from "lucide-react";
import { productService } from "../services/productService.js";
import { orderService } from "../services/orderService.js";
import { getErrorMessage, resolveAssetUrl } from "../services/api.js";
import { formatRupees } from "../utils/format.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function CustomerDashboard() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(searchParams.get("product") || "");
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();

  const selected = useMemo(
    () => products.find((product) => product._id === selectedProduct),
    [products, selectedProduct]
  );

  const total = selected ? Number(selected.price) * Number(quantity || 1) : 0;

  const loadData = async () => {
    const [productData, orderData] = await Promise.all([productService.list(), orderService.mine()]);
    setProducts(productData);
    setOrders(orderData);
    if (!selectedProduct && productData[0]) {
      setSelectedProduct(productData[0]._id);
    }
  };

  useEffect(() => {
    loadData().catch((err) => setError(getErrorMessage(err)));
  }, []);

  const handleOrder = async (event) => {
    event.preventDefault();
    try {
      setError("");
      setMessage("");
      await orderService.create({
        products: [{ product: selectedProduct, quantity: Number(quantity) }],
        paymentMethod,
        shippingAddress: user.address || "Customer address"
      });
      setMessage("Order placed successfully");
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <main className="page-shell dashboard-shell">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Customer</span>
          <h1>Buy Fresh Produce</h1>
        </div>
      </div>

      <div className="dashboard-grid">
        <form className="panel" onSubmit={handleOrder}>
          <h2>Place Order</h2>
          {error && <p className="alert error">{error}</p>}
          {message && <p className="alert success">{message}</p>}
          <label>
            Product
            <select value={selectedProduct} onChange={(event) => setSelectedProduct(event.target.value)} required>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name} - {formatRupees(product.price)}
                </option>
              ))}
            </select>
          </label>
          <label>
            Quantity
            <input min="1" type="number" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
          </label>
          <label>
            Payment
            <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="GPay">GPay</option>
            </select>
          </label>
          <div className="total-box">
            <IndianRupee size={18} />
            Total {formatRupees(total)}
          </div>
          <button className="primary-button full-button" type="submit" disabled={!selectedProduct}>
            <CreditCard size={18} />
            Place Order
          </button>
        </form>

        <section className="panel">
          <h2>Selected Product</h2>
          {selected ? (
            <div className="selected-product">
              <img src={resolveAssetUrl(selected.image)} alt={selected.name} />
              <h3>{selected.name}</h3>
              <p>{selected.description}</p>
              <span>{selected.quantity} {selected.unit} available</span>
            </div>
          ) : (
            <p className="muted">Choose a product to buy.</p>
          )}
        </section>
      </div>

      <section className="panel full-panel">
        <h2>
          <ShoppingCart size={20} />
          My Orders
        </h2>
        <div className="table-list">
          {orders.map((order) => (
            <div className="table-row" key={order._id}>
              <span>{order.products.map((item) => item.product?.name).join(", ")}</span>
              <span>{order.paymentMethod}</span>
              <strong>{formatRupees(order.totalPrice)}</strong>
              <span className="status">{order.status}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
