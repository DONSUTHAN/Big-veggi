import React from "react";
import { ArrowDown, Sprout } from "lucide-react";
import "./Main.css";

export default function Main({ onShopNow }) {
  return (
    <section className="main-hero">
      <div className="hero-content">
        <span className="hero-kicker">
          <Sprout size={18} />
          Farmer direct marketplace
        </span>
        <h1>Fresh vegetables, fruits, and grains from real local farmers.</h1>
        <p>Big-veggi connects farmers and customers for direct selling, fair prices, and simple ordering.</p>
        <button className="primary-button hero-button" type="button" onClick={onShopNow}>
          Shop Now
          <ArrowDown size={18} />
        </button>
      </div>
    </section>
  );
}
