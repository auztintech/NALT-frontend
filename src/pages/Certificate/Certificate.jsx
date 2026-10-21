import { useState } from "react";
import axios from "axios";
import { endpoint } from "../../api/endpoints";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Certificate.css";

const CertificateCard = ({ name, institution, type, onDownload }) => (
  <div className="cert-wrapper" id={type === "institutional" ? "cert-institutional" : "cert-personal"}>
    <div className="cert-document">
      {/* Corner decorations */}
      <div className="cert-corner cert-corner--tl" />
      <div className="cert-corner cert-corner--tr" />
      <div className="cert-corner cert-corner--bl" />
      <div className="cert-corner cert-corner--br" />

      {/* Gold border frame */}
      <div className="cert-frame">
        {/* Badge */}
        <div className="cert-badge">
          <div className="cert-badge-inner">★</div>
        </div>

        <p className="cert-heading">CERTIFICATE</p>
        <p className="cert-subheading">OF PARTICIPATION</p>

        <div className="cert-divider" />

        <p className="cert-presented">This certificate is proudly presented to</p>

        <p className="cert-name">{name}</p>

        <div className="cert-name-rule" />

        <p className="cert-body">
          {type === "institutional"
            ? <>For the institutional participation of <strong>{institution}</strong> in the</>
            : <>For participating in the</>
          }
          <br />
          <strong>57th Annual Conference of the Nigerian Association of Law Teachers (NALT)</strong>
          <br />
          held at the Faculty of Law, University of Benin, Benin City
          <br />
          18th – 22nd October, 2026.
        </p>

        <div className="cert-sig-row">
          <div className="cert-sig-block">
            <div className="cert-sig-line" />
            <p className="cert-sig-name">Prof. Abiodun Odutola</p>
            <p className="cert-sig-role">Chairman, Local Organising Committee</p>
          </div>
          <div className="cert-sig-block">
            <div className="cert-sig-line" />
            <p className="cert-sig-name">Prof. Taiwo Osipitan SAN</p>
            <p className="cert-sig-role">President, NALT</p>
          </div>
        </div>
      </div>
    </div>

    <button className="cert-download-btn" onClick={() => onDownload(type)}>
      ↓ Download {type === "institutional" ? "Institutional" : "Personal"} Certificate
    </button>
  </div>
);

const Certificate = () => {
  const [email, setEmail] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await axios.get(endpoint().registration.certificate, {
        params: { email },
      });
      setData(res.data);
    } catch (err) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (type) => {
    const id = type === "institutional" ? "cert-institutional" : "cert-personal";
    const el = document.getElementById(id);
    if (!el) return;
    // Use browser print for clean PDF
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Certificate</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cinzel:wght@400;700&family=Lato:wght@300;400;700&display=swap');
            body { margin: 0; padding: 0; }
            ${document.querySelector("style") ? document.querySelector("style").innerHTML : ""}
          </style>
          <link rel="stylesheet" href="${window.location.origin}/assets/index.css" />
        </head>
        <body onload="window.print();window.close();">
          ${el.querySelector(".cert-document").outerHTML}
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <>
      <Header />
      <div className="cert-hero">
        <div className="cert-hero-inner">
          <p className="cert-hero-eyebrow">57th NALT Annual Conference · 2026</p>
          <h1 className="cert-hero-title">Download Your <em>Certificate</em></h1>
          <p className="cert-hero-sub">
            Enter your registration email address to access and download your certificate of participation.
          </p>
        </div>
        <div className="cert-hero-rule" />
      </div>

      <div className="cert-page">
        <form className="cert-form" onSubmit={handleFetch}>
          <input
            className="cert-input"
            type="email"
            placeholder="Enter your registration email…"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="cert-submit" type="submit" disabled={loading}>
            {loading ? "Searching…" : "Get Certificate"}
          </button>
        </form>

        {error && <p className="cert-error">{error}</p>}

        {data && (
          <div className="cert-results">
            <p className="cert-found">
              Found registration for <strong>{data.full_name}</strong>
            </p>
            <div className="cert-cards">
              <CertificateCard
                name={data.full_name}
                institution={data.institution}
                type="personal"
                onDownload={handleDownload}
              />
              {data.has_institutional && (
                <CertificateCard
                  name={data.institution}
                  institution={data.institution}
                  type="institutional"
                  onDownload={handleDownload}
                />
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Certificate;