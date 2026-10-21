import { useState, useEffect } from "react";
import axios from "axios";
import { endpoint } from "../../api/endpoints";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Certificate.css";

// Path to the NALT logo. Save the association's logo (ideally a PNG) at:
//   public/nalt-logo.png
// A white background is fine — it's blended out with mix-blend-mode in the CSS.
const LOGO_SRC = "/nalt-logo.png";

// Signatories, in display order: Secretary (left), President (centre), Chairman (right).
// `sign` renders in cursive as the "signature"; `name` + `role` are printed below.
const SIGNATORIES = [
  {
    sign: "Esa O. Onoja",
    name: "Dr. Esa O. Onoja",
    role: "General Secretary, NALT",
  },
  {
    sign: "John A. Akintayo",
    name: "Prof. John A. Akintayo",
    role: "President, NALT",
  },
  {
    sign: "Bright Bazuaye",
    name: "Prof. Bright Bazuaye",
    role: "Chairman, Local Organising Committee",
  },
];

// Recipient name with their title in brackets after it, e.g. "Jane Doe (Prof.)".
// Brackets are omitted when the title is empty or "Other".
const formatRecipient = (name, title) => {
  const n = (name || "").trim();
  if (!n) return "";
  const t = (title || "").trim();
  if (!t || t.toLowerCase() === "other") return n;
  return `${n} (${t})`;
};

const CertificateCard = ({ recipient, institution, type, onDownload }) => {
  const isInstitutional = type === "institutional";
  return (
    <div
      className="cert-wrapper"
      id={isInstitutional ? "cert-institutional" : "cert-personal"}
    >
      <div className="cert-document">
        {/* Logo watermark */}
        <div
          className="cert-watermark"
          style={{ backgroundImage: `url(${LOGO_SRC})` }}
        />

        {/* Corner ornaments */}
        <span className="cert-orn cert-orn--tl" />
        <span className="cert-orn cert-orn--tr" />
        <span className="cert-orn cert-orn--bl" />
        <span className="cert-orn cert-orn--br" />

        <div className="cert-frame">
          <img className="cert-logo" src={LOGO_SRC} alt="NALT logo" />

          <p className="cert-heading">Certificate</p>
          <p className="cert-subheading">of&nbsp;&nbsp;Participation</p>

          <span className="cert-divider" />

          <p className="cert-presented">This certificate is proudly presented to</p>

          <p className="cert-name">{recipient}</p>
          <span className="cert-name-rule" />

          <p className="cert-body">
            {isInstitutional ? (
              <>
                In recognition of the institutional participation of{" "}
                <strong>{institution}</strong> in the
              </>
            ) : (
              <>In recognition of active participation in the</>
            )}
            <br />
            <strong>
              57th Annual Conference of the Nigerian Association of Law Teachers
              (NALT)
            </strong>
            <br />
            held at the Faculty of Law, University of Benin, Benin City,
            <br />
            18th&nbsp;–&nbsp;22nd October,&nbsp;2026.
          </p>

          <p className="cert-given">
            Given at Benin City on the 22nd day of October, 2026.
          </p>

          <div className="cert-sign-row">
            {SIGNATORIES.map((s) => (
              <div className="cert-sign" key={s.name}>
                <span className="cert-sign-script">{s.sign}</span>
                <span className="cert-sign-line" />
                <span className="cert-sign-name">{s.name}</span>
                <span className="cert-sign-role">{s.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className="cert-download-btn" onClick={() => onDownload(type)}>
        Download {isInstitutional ? "Institutional" : "Personal"} Certificate
      </button>
    </div>
  );
};

const Certificate = () => {
  const [email, setEmail] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Warm the logo into cache so it's ready when the print window opens.
  useEffect(() => {
    const img = new Image();
    img.src = LOGO_SRC;
  }, []);

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
    const wrapper = document.getElementById(id);
    const doc = wrapper?.querySelector(".cert-document");
    if (!doc) return;

    // Copy every stylesheet and <style> from the current page into the print
    // window, by reading their real hrefs — so the hashed Vite CSS resolves
    // correctly instead of a hardcoded (and non-existent) /assets/index.css.
    const styleTags = [
      ...document.querySelectorAll('link[rel="stylesheet"], style'),
    ]
      .map((node) => node.outerHTML)
      .join("\n");

    const title = `NALT Certificate${
      data?.full_name ? " - " + data.full_name : ""
    }`;

    const win = window.open("", "_blank", "width=1200,height=850");
    if (!win) {
      setError(
        "Your browser blocked the download window. Please allow pop-ups for this site and try again."
      );
      return;
    }

    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${title}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cinzel:wght@400;600;700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet" />
          ${styleTags}
          <style>
            @page { size: A4 landscape; margin: 0; }
            html, body { margin: 0; padding: 0; background: #ffffff; }
            .print-stage {
              width: 297mm; height: 210mm;
              display: flex; align-items: center; justify-content: center;
              box-sizing: border-box; padding: 8mm;
            }
            .print-stage .cert-document {
              width: 100%; max-width: none; box-shadow: none;
            }
            /* Make gold, navy and the watermark actually print */
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          </style>
        </head>
        <body>
          <div class="print-stage">${doc.outerHTML}</div>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();

    const go = () => {
      win.print();
      win.close();
    };
    // Wait for fonts (and give the watermark a beat) before printing.
    if (win.document.fonts && win.document.fonts.ready) {
      win.document.fonts.ready.then(() => setTimeout(go, 400));
    } else {
      setTimeout(go, 900);
    }
  };

  const recipientName = formatRecipient(data?.full_name, data?.title);

  return (
    <>
      <Header />
      <div className="cert-hero">
        <div className="cert-hero-inner">
          <p className="cert-hero-eyebrow">57th NALT Annual Conference · 2026</p>
          <h1 className="cert-hero-title">
            Download Your <em>Certificate</em>
          </h1>
          <p className="cert-hero-sub">
            Enter the email address you used during registration to retrieve and
            download your certificate of participation.
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
              Registration found for <strong>{recipientName}</strong>
            </p>
            <div className="cert-cards">
              <CertificateCard
                recipient={recipientName}
                institution={data.institution}
                type="personal"
                onDownload={handleDownload}
              />
              {data.has_institutional && (
                <CertificateCard
                  recipient={data.institution}
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