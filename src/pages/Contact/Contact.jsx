import { useState, useRef } from "react";
import "./Contact.css";
import emailjs from "@emailjs/browser";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
// ─── EmailJS CDN is loaded in index.html or via npm:
//   npm install @emailjs/browser
//   then: import emailjs from '@emailjs/browser'
//
// SETUP INSTRUCTIONS:
//   1. Create a free account at https://www.emailjs.com
//   2. Add an Email Service (Gmail, Outlook, etc.) → copy SERVICE_ID
//   3. Create an Email Template using variables:
//      {{from_name}}, {{from_email}}, {{phone}}, {{institution}},
//      {{subject}}, {{message}}  → copy TEMPLATE_ID
//   4. Copy your PUBLIC_KEY from Account > API Keys
//   5. Replace the three placeholder strings below

const EMAILJS_SERVICE_ID = "service_gr9odaf";
const EMAILJS_TEMPLATE_ID = "template_85pn2kf";
const EMAILJS_PUBLIC_KEY = "8PyAhIMZbwjLSEKY1";

// Google Maps embed — Faculty of Law, UNIBEN (lat 6.4007, lng 5.6221)
const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.4!2d5.6198!3d6.4007" +
  "!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1" +
  "!3m3!1m2!1s0x10472b2e55e62aed%3A0x82c538d82d4d23ee!2sFaculty%20Of%20Law%2C%20University%20of%20Benin" +
  "!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng";

const SUBJECTS = [
  "Registration & Payment",
  "Abstract / Paper Submission",
  "Accommodation & Travel",
  "Sponsorship & Exhibition",
  "General Enquiry",
];

const INITIAL = {
  fullName: "",
  email: "",
  phone: "",
  institution: "",
  subject: "",
  message: "",
};

export default function ContactUs() {
  const formRef = useRef(null);
  const [fields, setFields] = useState(INITIAL);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [touched, setTouched] = useState({});

  const set = (key) => (e) =>
    setFields((p) => ({ ...p, [key]: e.target.value }));
  const blur = (key) => () => setTouched((p) => ({ ...p, [key]: true }));

  const errors = {
    fullName: !fields.fullName.trim() ? "Required" : null,
    email: !/\S+@\S+\.\S+/.test(fields.email) ? "Valid email required" : null,
    phone: !fields.phone.trim() ? "Required" : null,
    institution: !fields.institution.trim() ? "Required" : null,
    subject: !fields.subject ? "Required" : null,
    message:
      fields.message.trim().length < 10
        ? "Please elaborate (min 10 chars)"
        : null,
  };
  const isValid = Object.values(errors).every((e) => e === null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      institution: true,
      subject: true,
      message: true,
    });
    if (!isValid) return;

    setStatus("sending");
    try {
      // dynamic import so build doesn't fail without the package installed
      const emailjs = (await import("@emailjs/browser")).default;
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY,
      );
      setStatus("success");
      setFields(INITIAL);
      setTouched({});
      // } catch (err) {
      //   console.error(err);
      //   setStatus("error");
      // }
    } catch (err) {
      console.error("EmailJS Error:", err);

      alert(`Error: ${err?.text || err?.message || "Unknown error"}`);

      setStatus("error");
    }
  };

  return (
    <>
      <Header />
      <section className="nc-section" id="contact">
        <div className="nc-container">
          {/* ── Header ── */}
          <div className="nc-header">
            <span className="nc-eyebrow">Contact Us</span>
            <h2 className="nc-title">
              Reach the{" "}
              <span className="nc-title-accent">Host Institution</span>
            </h2>
            <p className="nc-desc">
              For enquiries about the 57th NALT National Conference —
              registration, paper submissions, accommodation, or sponsorships —
              we're here to help.
            </p>
          </div>

          {/* ── Body grid ── */}
          <div className="nc-body">
            {/* LEFT column */}
            <div className="nc-left">
              <div className="nc-info-block">
                <p className="nc-info-label">Secretariat Address</p>
                <p className="nc-info-value">
                  Nigerian Association of Law Teachers
                  <br />
                  Faculty of Law, University of Benin
                  <br />
                  Benin City, Edo State
                </p>
              </div>

              <div className="nc-rule" />

              <div className="nc-info-block">
                <p className="nc-info-label">Email</p>
                <p className="nc-info-value">
                  <a href="mailto:conference@nalt.org.ng" className="nc-link">
                    conference@nalt.org.ng
                  </a>
                  <br />
                  <a href="mailto:secretariat@nalt.org.ng" className="nc-link">
                    secretariat@nalt.org.ng
                  </a>
                </p>
              </div>

              <div className="nc-rule" />

              <div className="nc-info-block">
                <p className="nc-info-label">Phone</p>
                <p className="nc-info-value">
                  <a href="tel:+2348012345678" className="nc-link">
                    +234 801 234 5678
                  </a>
                  <br />
                  <a href="tel:+2348098765432" className="nc-link">
                    +234 809 876 5432
                  </a>
                </p>
              </div>

              <div className="nc-rule" />

              {/* Dates card */}
              <div className="nc-dates-card">
                <p className="nc-info-label">Conference Dates</p>
                <p className="nc-dates-value">18 – 22 October, 2026</p>
                <p className="nc-dates-venue">
                  Faculty of Law, University of Benin · Benin City, Edo State
                </p>
              </div>

              {/* Map */}
              <div className="nc-map-wrap">
                <iframe
                  title="Faculty of Law, University of Benin"
                  src={MAP_EMBED_URL}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* RIGHT column — Form */}
            <div className="nc-right">
              <p className="nc-form-heading">Send an Enquiry</p>
              <p className="nc-form-sub">
                We respond within 24 – 48 hours on working days.
              </p>

              {status === "success" ? (
                <div className="nc-success">
                  <p className="nc-success-title">Message received.</p>
                  <p className="nc-success-body">
                    Thank you for reaching out. A member of the secretariat will
                    respond to your enquiry within 24 – 48 working hours.
                  </p>
                  <button
                    className="nc-reset"
                    onClick={() => setStatus("idle")}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} noValidate>
                  <div className="nc-row">
                    <Field
                      label="Full Name"
                      name="fullName"
                      type="text"
                      placeholder="Dr. Amaka Okonkwo"
                      value={fields.fullName}
                      onChange={set("fullName")}
                      onBlur={blur("fullName")}
                      error={touched.fullName && errors.fullName}
                    />
                    <Field
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      placeholder="08012345678"
                      value={fields.phone}
                      onChange={set("phone")}
                      onBlur={blur("phone")}
                      error={touched.phone && errors.phone}
                    />
                  </div>

                  <Field
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="amaka@unilag.edu.ng"
                    value={fields.email}
                    onChange={set("email")}
                    onBlur={blur("email")}
                    error={touched.email && errors.email}
                  />

                  <Field
                    label="Institution / Organisation"
                    name="institution"
                    type="text"
                    placeholder="University of Lagos"
                    value={fields.institution}
                    onChange={set("institution")}
                    onBlur={blur("institution")}
                    error={touched.institution && errors.institution}
                  />

                  <div className="nc-field">
                    <label className="nc-label" htmlFor="subject">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      className={`nc-select${touched.subject && errors.subject ? " nc-input--err" : ""}`}
                      value={fields.subject}
                      onChange={set("subject")}
                      onBlur={blur("subject")}
                    >
                      <option value="" disabled>
                        Select an enquiry type
                      </option>
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {touched.subject && errors.subject && (
                      <span className="nc-error">{errors.subject}</span>
                    )}
                  </div>

                  <div className="nc-field">
                    <label className="nc-label" htmlFor="message">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      className={`nc-textarea${touched.message && errors.message ? " nc-input--err" : ""}`}
                      placeholder="Type your message here…"
                      value={fields.message}
                      onChange={set("message")}
                      onBlur={blur("message")}
                    />
                    {touched.message && errors.message && (
                      <span className="nc-error">{errors.message}</span>
                    )}
                  </div>

                  {status === "error" && (
                    <p className="nc-send-error">
                      Something went wrong. Please try again or email us
                      directly.
                    </p>
                  )}

                  <button
                    type="submit"
                    className="nc-btn"
                    disabled={status === "sending"}
                  >
                    {status === "sending" ? "Sending…" : "Send Enquiry"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

function Field({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
}) {
  return (
    <div className="nc-field">
      <label className="nc-label" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`nc-input${error ? " nc-input--err" : ""}`}
      />
      {error && <span className="nc-error">{error}</span>}
    </div>
  );
}
