import React from "react";
import { Mail, MapPin, Phone, Tractor } from "lucide-react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <div className="footer-brand">
          <Tractor size={24} />
          <strong>Big-veggi</strong>
        </div>
        <p>Direct buying and selling between farmers and customers.</p>
      </div>
      <div>
        <h3>About Us</h3>
        <p>We help farmers list fresh produce and let customers order without middlemen.</p>
      </div>
      <div>
        <h3>Contact</h3>
        <p>
          <Phone size={16} /> +91 94345948543
        </p>
        <p>
          <Mail size={16} /> support@bigveggi.com
        </p>
        <p>
          <MapPin size={16} /> India
        </p>
      </div>
    </footer>
  );
}
