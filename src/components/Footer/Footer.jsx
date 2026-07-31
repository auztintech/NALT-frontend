import { Link } from "react-router-dom";
import "./Footer.css";
import naltLogo from "../../assets/images/nalt-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    {
      heading: "Conference",
      items: [
        { label: "Communiqué & Resolutions", to: "/conference/communique" },
        { label: "Programme & Schedule", to: "/conference/schedule" },
        { label: "Download Resources", to: "/conference/resources" },
      ],
    },
    {
      heading: "Membership",
      items: [
        { label: "Institutional Subscription", to: "/membership/institutional" },
        { label: "Individual Fees by Rank", to: "/membership/fees" },
        { label: "Payment & Registration", to: "/membership/payment" },
      ],
    },
    {
      heading: "Logistics",
      items: [
        { label: "Recommended Hotels", to: "/logistics/hotels" },
        { label: "Venue & Directions", to: "/logistics/venue" },
        { label: "Airport Shuttle Schedule", to: "/logistics/shuttle" },
      ],
    },
    {
      heading: "Leadership",
      items: [
        { label: "National Executives", to: "/leadership/executives" },
        { label: "Local Organising Committee", to: "/leadership/loc" },
      ],
    },
    {
      heading: "Quick Links",
      items: [
        { label: "Home", to: "/" },
        { label: "About", to: "/about" },
        { label: "Announcements", to: "/announcements" },
        { label: "Articles", to: "/articles" },
        { label: "Contact", to: "/contact" },
      ],
    },
  ];

  return (
    <footer className="nalt-footer">
      {/* Top band */}
      <div className="nalt-footer__top">
        <div className="nalt-footer__brand">
          <Link to="/" className="nalt-footer__logo">
            <img src={naltLogo} alt="Nigerian Association of Law Teachers" height="56px" />
          </Link>
          <p className="nalt-footer__tagline">
            Nigerian Association of Law Teachers
          </p>
          <p className="nalt-footer__desc">
            Advancing legal education and scholarship across Nigeria since 1963.
            Hosting the 57th Annual Conference at the University of Benin,
            October 2026.
          </p>
          <Link to="/register" className="nalt-footer__cta">
            Register Now
          </Link>
        </div>

        {/* Nav columns */}
        <nav className="nalt-footer__nav">
          {links.map((col) => (
            <div key={col.heading} className="nalt-footer__col">
              <h4 className="nalt-footer__col-heading">{col.heading}</h4>
              <ul>
                {col.items.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Divider */}
      <div className="nalt-footer__divider" />

      {/* Conference callout */}
      <div className="nalt-footer__callout">
        <div className="nalt-footer__callout-inner">
          <span className="nalt-footer__callout-label">57th Annual Conference</span>
          <span className="nalt-footer__callout-dot" />
          <span className="nalt-footer__callout-text">
            18th – 22nd October, 2026
          </span>
          <span className="nalt-footer__callout-dot" />
          <span className="nalt-footer__callout-text">
            Faculty of Law, University of Benin, Benin City
          </span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="nalt-footer__bottom">
        <p className="nalt-footer__copy">
          &copy; {currentYear} Nigerian Association of Law Teachers. All rights reserved.
        </p>
        <div className="nalt-footer__legal">
          <Link to="/privacy">Privacy Policy</Link>
          <span>·</span>
          <Link to="/terms">Terms of Use</Link>
          <span>·</span>
          <Link to="/contact">Contact Us</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;