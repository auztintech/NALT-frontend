import Header from "../../components/Header/Header";
import "./Hotels.css";

const hotels = [
  { name: "All Saints Guest House", tag: "Guest House" },
  { name: "Royal Choice Inn", tag: "Hotel" },
  { name: "Palm Royal Hotel", tag: "Hotel" },
  { name: "Top End Service Apartment", tag: "Service Apartment", badge: "UBTH Estate" },
  { name: "Valedero's Place", tag: "Service Apartment", badge: "UBTH Estate" },
  { name: "El Rey Luxury Apartment", tag: "Luxury Apartment", badge: "UBTH Estate" },
];

export default function Hotels() {
  return (
    <>
    <Header />
    <div className="ht-page">
      {/* Hero */}
      <div className="ht-hero">
        <div className="ht-hero__inner">
          <p className="ht-hero__eyebrow">57th Annual Conference · 2026</p>
          <h1 className="ht-hero__title">Recommended Hotels</h1>
          <p className="ht-hero__sub">
            Carefully selected accommodations close to the Faculty of Law,
            University of Benin, Benin City, Edo State.
          </p>
        </div>
      </div>

      <div className="ht-body">
        {/* Notice */}
        <div className="ht-notice">
          <p>
            The following hotels and service apartments are recommended for
            conference attendees. Kindly mention your participation in the
            <strong> 57th NALT Annual Conference</strong> when making your
            booking to inquire about available conference rates.
          </p>
        </div>

        {/* Hotel list */}
        <div className="ht-grid">
          {hotels.map((hotel, i) => (
            <div key={i} className="ht-card">
              <div className="ht-card__number">{String(i + 1).padStart(2, "0")}</div>
              <div className="ht-card__content">
                <div className="ht-card__top">
                  <h2 className="ht-card__name">{hotel.name}</h2>
                  <div className="ht-card__badges">
                    <span className="ht-card__tag">{hotel.tag}</span>
                    {hotel.badge && (
                      <span className="ht-card__badge">{hotel.badge}</span>
                    )}
                  </div>
                </div>
                <p className="ht-card__location">Benin City, Edo State</p>
              </div>
            </div>
          ))}
        </div>

        {/* Info strip */}
        <div className="ht-info">
          <div className="ht-info__item">
            <span className="ht-info__label">Conference Dates</span>
            <span className="ht-info__value">18th – 22nd October, 2026</span>
          </div>
          <div className="ht-info__divider" />
          <div className="ht-info__item">
            <span className="ht-info__label">Venue</span>
            <span className="ht-info__value">Faculty of Law, University of Benin</span>
          </div>
          <div className="ht-info__divider" />
          <div className="ht-info__item">
            <span className="ht-info__label">City</span>
            <span className="ht-info__value">Benin City, Edo State</span>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}