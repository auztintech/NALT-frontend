import { useState, useEffect } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { endpoint } from "../../api/endpoints";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Certificate.css";

// Path to the NALT logo. Save the association's logo at: public/nalt-logo.png
// A white background is fine — it's blended out on screen, and removed in code
// before the PDF is generated.
const LOGO_SRC = "/NALT.jpg";

// Size the downloaded certificate at A4 landscape (96dpi) so it's always crisp,
// regardless of the screen it was triggered from.
const PRINT_W = 1123;
const PRINT_H = 794;

// Signatories, in display order: Secretary (left), President (centre), Chairman (right).
const SIGNATORIES = [
  { sign: "Esa O. Onoja", name: "Dr. Esa O. Onoja", role: "General Secretary, NALT" },
  { sign: "John A. Akintayo", name: "Prof. John A. Akintayo", role: "President, NALT" },
  { sign: "Bright Bazuaye", name: "Prof. Bright Bazuaye", role: "Chairman, Local Organising Committee" },
];

// Recipient name in Title Case with the title in brackets after it,
// e.g. "John Oluwatomisin Akinselure (Prof.)". Brackets omitted for empty/"Other".
const toTitleCase = (str) =>
  str.replace(/\S+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

const formatRecipient = (name, title) => {
  const n = (name || "").trim();
  if (!n) return "";
  const display = toTitleCase(n);
  const t = (title || "").trim();
  if (!t || t.toLowerCase() === "other") return display;
  return `${display} (${t})`;
};

// Load an image and resolve once it's ready.
const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

// Turn the logo's white background transparent (same-origin file, so the canvas
// stays untainted). Falls back to the original URL if anything goes wrong.
const transparentLogo = async (src) => {
  try {
    const img = await loadImage(src);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const px = data.data;
    for (let i = 0; i < px.length; i += 4) {
      if (px[i] > 235 && px[i + 1] > 235 && px[i + 2] > 235) px[i + 3] = 0;
    }
    ctx.putImageData(data, 0, 0);
    return canvas.toDataURL("image/png");
  } catch {
    return src;
  }
};

const CertificateCard = ({ recipient, institution, type, busy, onDownload }) => {
  const isInstitutional = type === "institutional";
  return (
    <div className="cert-wrapper" id={isInstitutional ? "cert-institutional" : "cert-personal"}>
      <div className="cert-document">
        <div className="cert-watermark" style={{ backgroundImage: `url(${LOGO_SRC})` }} />

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
              57th Annual Conference of the Nigerian Association of Law Teachers (NALT)
            </strong>
            <br />
            held at the Faculty of Law, University of Benin, Benin City,
            <br />
            18th&nbsp;–&nbsp;22nd October,&nbsp;2026.
          </p>

          <p className="cert-given">Given at Benin City on the 22nd day of October, 2026.</p>

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

      <button className="cert-download-btn" onClick={() => onDownload(type)} disabled={busy}>
        {busy
          ? "Preparing…"
          : `Download ${isInstitutional ? "Institutional" : "Personal"} Certificate`}
      </button>
    </div>
  );
};

const Certificate = () => {
  const [email, setEmail] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(null); // which card is being generated

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
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (type) => {
    const id = type === "institutional" ? "cert-institutional" : "cert-personal";
    const source = document.getElementById(id)?.querySelector(".cert-document");
    if (!source) return;

    setDownloading(type);
    setError("");

    // Build an off-screen, full-size copy so the PDF is always A4-landscape and
    // crisp — independent of the phone/desktop the download came from.
    const holder = document.createElement("div");
    holder.style.cssText = `position:fixed;left:-99999px;top:0;width:${PRINT_W}px;z-index:-1;`;
    const clone = source.cloneNode(true);
    clone.style.width = `${PRINT_W}px`;
    clone.style.height = `${PRINT_H}px`;
    clone.style.maxWidth = "none";
    clone.style.aspectRatio = "auto";

    holder.appendChild(clone);
    document.body.appendChild(holder);

    try {
      await (document.fonts ? document.fonts.ready : Promise.resolve());

      // Replace the white-background logo with a transparent version so the PDF
      // has no white boxes (html2canvas can't do mix-blend-mode).
      const logoUrl = await transparentLogo(LOGO_SRC);
      const cloneLogo = clone.querySelector(".cert-logo");
      if (cloneLogo) {
        cloneLogo.src = logoUrl;
        cloneLogo.style.mixBlendMode = "normal";
        cloneLogo.style.filter = "none";
      }
      const cloneWm = clone.querySelector(".cert-watermark");
      if (cloneWm) {
        cloneWm.style.backgroundImage = `url(${logoUrl})`;
        cloneWm.style.mixBlendMode = "normal";
      }

      await new Promise((r) => setTimeout(r, 150)); // let the swapped image paint

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        width: PRINT_W,
        height: PRINT_H,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
        hotfixes: ["px_scaling"],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

      const who = data?.full_name ? ` - ${toTitleCase(data.full_name)}` : "";
      pdf.save(`NALT Certificate${who}.pdf`);
    } catch (err) {
      setError("Could not generate the certificate. Please try again.");
    } finally {
      document.body.removeChild(holder);
      setDownloading(null);
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
                busy={downloading === "personal"}
                onDownload={handleDownload}
              />
              {data.has_institutional && (
                <CertificateCard
                  recipient={data.institution}
                  institution={data.institution}
                  type="institutional"
                  busy={downloading === "institutional"}
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