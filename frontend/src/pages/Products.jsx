import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag } from "lucide-react";
import { productService } from "../services/productService.js";
import { getErrorMessage, resolveAssetUrl } from "../services/api.js";
import { formatRupees } from "../utils/format.js";
import { useAuth } from "../context/AuthContext.jsx";

const categories = ["All", "Fruit", "Vegetable", "Grain", "Dairy", "Other"];

export default function Products({ embedded = false }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await productService.list({ search, category });
        setProducts(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(loadProducts, 250);
    return () => clearTimeout(timer);
  }, [search, category]);

  const title = useMemo(() => (embedded ? "Available Products" : "Products"), [embedded]);

  const handleBuy = (productId) => {
    if (!user) {
      navigate("/register");
      return;
    }

    navigate(`/customer?product=${productId}`);
  };

  return (
    <main className={embedded ? "section-shell" : "page-shell"}>
      <div className="section-heading">
        <div>
          <span className="eyebrow">Farm stock</span>
          <h2>{title}</h2>
        </div>
        {!embedded && <p>Prices are listed in rupees and updated by farmers.</p>}
      </div>

      <div className="product-toolbar">
        <label className="search-box">
          <Search size={18} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" />
        </label>
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="alert error">{error}</p>}
      {loading && <p className="muted">Loading products...</p>}

      {!loading && products.length === 0 && <p className="muted">No products available yet.</p>}

      <div className="product-grid">
        {products.map((product) => (
          <article className="product-card" key={product._id}>
            <img src={resolveAssetUrl(product.image)} alt={product.name} />
            <div className="product-body">
              <div className="product-row">
                <span className="tag">{product.category}</span>
                <strong>{formatRupees(product.price)}</strong>
              </div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="product-meta">
                <span>
                  {product.quantity} {product.unit}
                </span>
                <span>{product.location || "Farm pickup"}</span>
              </div>
              <div className="product-farmer">
                Farmer: {product.farmer?.name || "Big-veggi farmer"}
              </div>
              <button className="secondary-button full-button" type="button" onClick={() => handleBuy(product._id)}>
                <ShoppingBag size={17} />
                Buy Now
              </button>
            </div>
          </article>
        ))}
      </div>

      {embedded && (
        <div className="center-link">
          <Link to="/products">View all products</Link>
        </div>
      )}
    </main>
  );
}
