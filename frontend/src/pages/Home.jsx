import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Main from "../components/Main.jsx";
import Products from "./Products.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const productRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleShopNow = () => {
    if (!user) {
      navigate("/register");
      return;
    }

    productRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Main onShopNow={handleShopNow} />
      <div ref={productRef}>
        <Products embedded />
      </div>
    </>
  );
}
