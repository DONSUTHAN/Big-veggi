import React, { useEffect, useState } from "react";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import { productService } from "../services/productService.js";
import { orderService } from "../services/orderService.js";
import { getErrorMessage, resolveAssetUrl } from "../services/api.js";
import { formatRupees } from "../utils/format.js";

const emptyProduct = {
  name: "",
  category: "Vegetable",
  description: "",
  price: "",
  quantity: "",
  unit: "kg",
  location: ""
};

export default function FarmerDashboard() {
  const [form, setForm] = useState(emptyProduct);
  const [image, setImage] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    const [myProducts, farmerOrders] = await Promise.all([productService.mine(), orderService.farmerOrders()]);
    setProducts(myProducts);
    setOrders(farmerOrders);
  };

  useEffect(() => {
    loadData().catch((err) => setError(getErrorMessage(err)));
  }, []);

  const updateForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    try {
      setError("");
      setMessage("");
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      if (image) data.append("image", image);
      if (selfie) data.append("selfie", selfie);

      await productService.create(data);
      setForm(emptyProduct);
      setImage(null);
      setSelfie(null);
      setMessage("Product uploaded successfully");
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async (id) => {
    await productService.remove(id);
    await loadData();
  };

  return (
    <main className="page-shell dashboard-shell">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Farmer</span>
          <h1>Upload Farm Products</h1>
        </div>
      </div>

      <div className="dashboard-grid">
        <form className="panel" onSubmit={handleUpload}>
          <h2>New Product</h2>
          {error && <p className="alert error">{error}</p>}
          {message && <p className="alert success">{message}</p>}
          <div className="form-grid two">
            <label>
              Product name
              <input name="name" value={form.name} onChange={updateForm} required />
            </label>
            <label>
              Category
              <select name="category" value={form.category} onChange={updateForm}>
                <option>Fruit</option>
                <option>Vegetable</option>
                <option>Grain</option>
                <option>Dairy</option>
                <option>Other</option>
              </select>
            </label>
            <label>
              Price
              <input name="price" type="number" min="1" value={form.price} onChange={updateForm} required />
            </label>
            <label>
              Quantity
              <input name="quantity" type="number" min="0" value={form.quantity} onChange={updateForm} required />
            </label>
            <label>
              Unit
              <input name="unit" value={form.unit} onChange={updateForm} />
            </label>
            <label>
              Location
              <input name="location" value={form.location} onChange={updateForm} />
            </label>
          </div>
          <label>
            Description
            <textarea name="description" value={form.description} onChange={updateForm} rows="3" required />
          </label>
          <div className="form-grid two">
            <label className="file-input">
              <ImagePlus size={18} />
              Product image
              <input type="file" accept="image/*" onChange={(event) => setImage(event.target.files[0])} />
            </label>
            <label className="file-input">
              <ImagePlus size={18} />
              Farmer selfie
              <input type="file" accept="image/*" onChange={(event) => setSelfie(event.target.files[0])} />
            </label>
          </div>
          <button className="primary-button full-button" type="submit">
            <Upload size={18} />
            Upload Product
          </button>
        </form>

        <section className="panel">
          <h2>Farmer Orders</h2>
          <div className="table-list compact">
            {orders.map((order) => (
              <div className="table-row" key={order._id}>
                <span>{order.customer?.name}</span>
                <strong>{formatRupees(order.totalPrice)}</strong>
                <span className="status">{order.status}</span>
              </div>
            ))}
            {orders.length === 0 && <p className="muted">No orders yet.</p>}
          </div>
        </section>
      </div>

      <section className="panel full-panel">
        <h2>My Products</h2>
        <div className="mini-product-grid">
          {products.map((product) => (
            <article className="mini-product" key={product._id}>
              <img src={resolveAssetUrl(product.image)} alt={product.name} />
              <div>
                <h3>{product.name}</h3>
                <p>{formatRupees(product.price)} / {product.unit}</p>
                <span>{product.quantity} {product.unit}</span>
              </div>
              <button className="icon-button danger" type="button" onClick={() => handleDelete(product._id)}>
                <Trash2 size={17} />
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
