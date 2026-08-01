import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import "./MembershipFees.css";
import { Link } from "react-router-dom";

const subscriptionFees = [
  { rank: "Institutional", amount: "₦50,000" },
  { rank: "Readers & Professors", amount: "₦30,000" },
  { rank: "Senior Lecturers", amount: "₦25,000" },
  { rank: "Lecturer I and Below", amount: "₦20,000" },
];

const registrationFees = [
  {
    type: "Early Bird",
    note: "Ends 30th August, 2026",
    amount: "₦30,000",
    highlight: true,
  },
  {
    type: "Regular",
    note: "Ends 30th September, 2026",
    amount: "₦40,000",
    highlight: false,
  },
  {
    type: "Late Registration",
    note: "Any time in October, 2026",
    amount: "₦50,000",
    highlight: false,
  },
];

const otherFees = [
  { type: "Non-members", amount: "₦100,000" },
  { type: "International", amount: "$250" },
  { type: "Online", amount: "₦20,000 / $25" },
];

const paymentDetails = [
  {
    label: "Annual Subscription",
    sub: "Individual & Institutional",
    details: [
      { key: "Account Name", value: "Nigerian Association of Law Teachers" },
      { key: "Account No", value: "2006806045" },
      { key: "Bank Name", value: "First City Monument Bank (FCMB)" },
    ],
  },
  {
    label: "Conference Registration Fees",
    sub: "",
    details: [
      { key: "Account Name", value: "Faculty of Law: NALT Conference" },
      { key: "Account No", value: "1312045217" },
      { key: "Bank Name", value: "Zenith Bank" },
    ],
  },
];

export default function MembershipFees() {
  return (
    <>
    <Header />
    
    <div className="mf-page">
      {/* Hero */}
      <div className="mf-hero">
        <div className="mf-hero__inner">
          <p className="mf-hero__eyebrow">57th Annual Conference · 2026</p>
          <h1 className="mf-hero__title">Membership & Registration Fees</h1>
          <p className="mf-hero__sub">
            Faculty of Law, University of Benin · 18th – 22nd October, 2026
          </p>
        </div>
      </div>

      <div className="mf-body">

        {/* Early bird banner */}
        <div className="mf-banner">
          <div className="mf-banner__left">
            <span className="mf-banner__tag">Special Prize</span>
            <p className="mf-banner__text">
              The first <strong>100 persons</strong> to register for the conference will get a special prize!
            </p>
          </div>
          <Link to="/register" className="mf-banner__cta">Register Now</Link>
        </div>

        {/* Fee tables grid */}
        <div className="mf-grid">

          {/* Subscription fees */}
          <div className="mf-card">
            <div className="mf-card__header">
              <h2 className="mf-card__title">Subscription Fees</h2>
              <p className="mf-card__sub">Annual membership by academic rank</p>
            </div>
            <div className="mf-table">
              {subscriptionFees.map((row, i) => (
                <div key={i} className="mf-table__row">
                  <span className="mf-table__rank">{row.rank}</span>
                  <span className="mf-table__amount">{row.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Registration fees */}
          <div className="mf-card">
            <div className="mf-card__header">
              <h2 className="mf-card__title">Registration Fees</h2>
              <p className="mf-card__sub">Conference attendance fees</p>
            </div>
            <div className="mf-table">
              {registrationFees.map((row, i) => (
                <div key={i} className={`mf-table__row ${row.highlight ? "mf-table__row--highlight" : ""}`}>
                  <div className="mf-table__reg-info">
                    <span className="mf-table__rank">{row.type}</span>
                    {row.note && <span className="mf-table__note">{row.note}</span>}
                  </div>
                  <span className="mf-table__amount">{row.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Others */}
          <div className="mf-card">
            <div className="mf-card__header">
              <h2 className="mf-card__title">Others</h2>
              <p className="mf-card__sub">Non-members & international attendees</p>
            </div>
            <div className="mf-table">
              {otherFees.map((row, i) => (
                <div key={i} className="mf-table__row">
                  <span className="mf-table__rank">{row.type}</span>
                  <span className="mf-table__amount">{row.amount}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Payment details */}
        <div className="mf-payment">
          <h2 className="mf-payment__title">Payment Details</h2>
          <p className="mf-payment__note">
            Kindly use your full name as payment reference.
          </p>
          <div className="mf-payment__grid">
            {paymentDetails.map((account, i) => (
              <div key={i} className="mf-account">
                <div className="mf-account__header">
                  <h3 className="mf-account__label">{account.label}</h3>
                  {account.sub && <p className="mf-account__sub">{account.sub}</p>}
                </div>
                <div className="mf-account__details">
                  {account.details.map((d, di) => (
                    <div key={di} className="mf-account__row">
                      <span className="mf-account__key">{d.key}</span>
                      <span className="mf-account__value">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="mf-contact">
          <p className="mf-contact__label">Enquiries</p>
          <div className="mf-contact__numbers">
            {["+234 802 339 7942", "+234 803 268 7289", "+234 806 754 1626", "+234 813 889 9353", "+234 803 735 3891"].map((num, i) => (
              <a key={i} href={`tel:${num.replace(/\s/g, "")}`} className="mf-contact__num">{num}</a>
            ))}
          </div>
        </div>

        {/* CTA strip */}
        <div className="mf-cta-strip">
          <div>
            <p className="mf-cta-strip__title">Ready to attend?</p>
            <p className="mf-cta-strip__sub">Secure your spot before the early bird deadline — 30th August 2026.</p>
          </div>
          <Link to="/register" className="mf-cta-btn">Register Now</Link>
        </div>

      </div>
    </div>
    <Footer />
    </>
  );
}