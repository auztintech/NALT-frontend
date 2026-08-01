import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";
import naltLogo from "../../assets/images/nalt-logo.png";

const navLinks = [
  { to: "/", label: "Home" },

  {
    label: "Conference",
    dropdown: [
      {
        to: "/conference/communique",
        label: "Communiqué & Resolutions",
        sub: "2026 General Assembly documents",
      },
      {
        to: "/conference/schedule",
        label: "Programme & Schedule",
        sub: "Sessions, keynotes & workshops",
      },
      {
        to: "/articles",
        label: "Download Resources",
        sub: "Papers, abstracts & materials",
      },
    ],
  },
  {
    label: "Membership",
    dropdown: [
      {
        to: "/membership/fees",
        label: "Institutional Subscription",
        sub: "Law faculties & institutions",
      },
      {
        to: "/membership/fees",
        label: "Individual Fees by Rank",
        sub: "Professors, SL, L1, Associate",

        dividerBefore: true,
      },
      {
        to: "/register",
        label: "Payment & Registration",
        sub: "How to pay & join NALT",
      },
    ],
  },
  {
    label: "Logistics",
    dropdown: [
      {
        to: "/logistics/hotels",
        label: "Recommended Hotels",
        sub: "NALT discount codes included",
      },
      {
        to: "/logistics/venue",
        label: "Venue & Directions",
        sub: "Map & getting there",
      },
      
    ],
  },
  {
    label: "Leadership",
    dropdown: [
      {
        to: "/leadership/executives",
        label: "National Executives",
        sub: "NALT national leadership",
      },
      {
        to: "/leadership/loc",
        label: "Local Organising Committee",
        sub: "Uniben planning committee",
      },
    ],
  },
  { to: "/announcements", label: "Announcements" },
  { to: "/articles", label: "Articles" },
  { to: "/contact", label: "Contact" },
];

const DropdownMenu = ({ items, onClose }) => (
  <div className="nalt-dropdown">
    {items.map((item) => (
      <React.Fragment key={item.to}>
        {item.dividerBefore && <div className="nalt-dropdown-divider" />}
        <Link to={item.to} className="nalt-dropdown-item" onClick={onClose}>
          <span className="nalt-dropdown-text">
            <span className="nalt-dropdown-label">{item.label}</span>
            {item.sub && <span className="nalt-dropdown-sub">{item.sub}</span>}
          </span>
        </Link>
      </React.Fragment>
    ))}
  </div>
);

const Header = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const headerRef = useRef(null);

  // const handleDropdown = (label) =>
  //   setOpenDropdown((prev) => (prev === label ? null : label));

  const closeAll = () => {
    setOpenDropdown(null);
    setMenuOpen(false);
    setMobileExpanded(null);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isDropdownActive = (items) =>
    items?.some((item) => location.pathname === item.to);

  return (
    <header className="nalt-header" ref={headerRef}>
      <Link to="/" className="nalt-logo" onClick={closeAll}>
        <img
          src={naltLogo}
          alt="Nigerian Association of Law Teachers"
          height="60px"
        />
      </Link>

      {/* Desktop Nav */}
      <ul className="nalt-nav">
        {navLinks.map((link) =>
          link.dropdown ? (
            // <li
            //   key={link.label}
            //   className={`nalt-nav-has-dropdown ${
            //     openDropdown === link.label ? "open" : ""
            //   } ${isDropdownActive(link.dropdown) ? "active" : ""}`}
            // >
            //   <button
            //     className="nalt-nav-dropdown-trigger"
            //     onClick={() => handleDropdown(link.label)}
            //     aria-expanded={openDropdown === link.label}
            //     aria-haspopup="true"
            //   >
            <li
              key={link.label}
              className={`nalt-nav-has-dropdown ${
                openDropdown === link.label ? "open" : ""
              } ${isDropdownActive(link.dropdown) ? "active" : ""}`}
              onMouseEnter={() => setOpenDropdown(link.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                className="nalt-nav-dropdown-trigger"
                aria-expanded={openDropdown === link.label}
                aria-haspopup="true"
              >
                {link.label}
                <i
                  className="ti ti-chevron-down nalt-chev"
                  aria-hidden="true"
                />
              </button>
              {openDropdown === link.label && (
                <DropdownMenu
                  items={link.dropdown}
                  onClose={() => setOpenDropdown(null)}
                />
              )}
            </li>
          ) : (
            <li
              key={link.to}
              className={location.pathname === link.to ? "active" : ""}
            >
              <Link to={link.to}>{link.label}</Link>
            </li>
          ),
        )}
      </ul>

      {/* CTA */}
      <Link to="/register" className="nalt-cta" onClick={closeAll}>
        Register Now
      </Link>

      {/* Mobile Hamburger */}
      <button
        className="nalt-hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="nalt-mobile-menu">
          {navLinks.map((link) =>
            link.dropdown ? (
              <div key={link.label} className="nalt-mobile-group">
                <button
                  className={`nalt-mobile-group-trigger ${
                    mobileExpanded === link.label ? "open" : ""
                  } ${isDropdownActive(link.dropdown) ? "active" : ""}`}
                  onClick={() =>
                    setMobileExpanded((prev) =>
                      prev === link.label ? null : link.label,
                    )
                  }
                >
                  {link.label}
                  <i
                    className="ti ti-chevron-down nalt-chev"
                    aria-hidden="true"
                  />
                </button>
                {mobileExpanded === link.label && (
                  <div className="nalt-mobile-submenu">
                    {link.dropdown.map((item) => (
                      <React.Fragment key={item.to}>
                        {item.dividerBefore && (
                          <div className="nalt-dropdown-divider" />
                        )}
                        <Link
                          to={item.to}
                          className="nalt-mobile-sublink"
                          onClick={closeAll}
                        >
                          {item.label}
                        </Link>
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                className={location.pathname === link.to ? "active" : ""}
                onClick={closeAll}
              >
                {link.label}
              </Link>
            ),
          )}
          <Link
            to="/register"
            className="nalt-cta mobile"
            style={{ color: "white" }}
            onClick={closeAll}
          >
            Register Now
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
