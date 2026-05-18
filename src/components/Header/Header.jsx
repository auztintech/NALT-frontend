import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";


const Header = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/announcements", label: "Announcements" },
    { to: "/articles", label: "Articles" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="nalt-header">
      <Link to="/" className="nalt-logo">
        NALT<span>.</span>
      </Link>

      {/* Desktop Nav */}
      <ul className="nalt-nav">
        {navLinks.map((link) => (
          <li key={link.to} className={location.pathname === link.to ? "active" : ""}>
            <Link to={link.to}>{link.label}</Link>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Link to="/register" className="nalt-cta">
        Register Now
      </Link>

      {/* Mobile Hamburger */}
      <button
        className="nalt-hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="nalt-mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={location.pathname === link.to ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/register" className="nalt-cta mobile" onClick={() => setMenuOpen(false)}>
            Register Now
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;