import Header from "../../components/Header/Header";
import "./Venue.css";

export default function Venue() {
  const googleMapsUrl =
    "https://www.google.com/maps/search/Faculty+of+Law+University+of+Benin+Benin+City";
  const embedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.0!2d5.6145!3d6.3350!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10391584b9c69c8b%3A0x5e5c8e6b4a2f1d2a!2sFaculty%20of%20Law%2C%20University%20of%20Benin!5e0!3m2!1sen!2sng!4v1690000000000";

    
  return (
    <>
    <Header />
    <div className="vn-page">
      {/* Hero */}
      <div className="vn-hero">
        <div className="vn-hero__inner">
          <p className="vn-hero__eyebrow">57th Annual Conference · 2026</p>
          <h1 className="vn-hero__title">Venue & Directions</h1>
          <p className="vn-hero__sub">
            Faculty of Law, University of Benin, Benin City, Edo State
          </p>
        </div>
      </div>

      <div className="vn-body">

        {/* Venue card */}
        <div className="vn-card">
          <div className="vn-card__left">
            <span className="vn-card__label">Conference Venue</span>
            <h2 className="vn-card__name">Faculty of Law</h2>
            <p className="vn-card__inst">University of Benin</p>
            <p className="vn-card__address">Benin City, Edo State, Nigeria</p>

            <div className="vn-card__divider" />

            <div className="vn-details">
              <div className="vn-detail">
                <span className="vn-detail__key">Conference Dates</span>
                <span className="vn-detail__val">18th – 22nd October, 2026</span>
              </div>
              <div className="vn-detail">
                <span className="vn-detail__key">Host Institution</span>
                <span className="vn-detail__val">University of Benin (UNIBEN)</span>
              </div>
              <div className="vn-detail">
                <span className="vn-detail__key">State</span>
                <span className="vn-detail__val">Edo State</span>
              </div>
              <div className="vn-detail">
                <span className="vn-detail__key">Country</span>
                <span className="vn-detail__val">Nigeria</span>
              </div>
            </div>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="vn-map-btn"
            >
              Open in Google Maps
            </a>
          </div>

          {/* Map embed */}
          <div className="vn-card__map">
            <iframe
              title="Faculty of Law, University of Benin"
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Getting there */}
        <div className="vn-getting">
          <h2 className="vn-getting__title">Getting There</h2>
          <div className="vn-getting__grid">
            <div className="vn-transport">
              <h3 className="vn-transport__mode">By Air</h3>
              <p className="vn-transport__desc">
                Fly into <strong>Benin Airport (BNI)</strong>, which is located
                approximately 7km from the University of Benin campus. Taxis
                and ride-hailing services are available at the airport.
              </p>
            </div>
            <div className="vn-transport">
              <h3 className="vn-transport__mode">By Road</h3>
              <p className="vn-transport__desc">
                Benin City is accessible from Lagos via the Benin–Ore Expressway
                and from Abuja via the Lokoja–Benin highway. The University of
                Benin is well signposted within the city.
              </p>
            </div>
            <div className="vn-transport">
              <h3 className="vn-transport__mode">Within Benin City</h3>
              <p className="vn-transport__desc">
                Taxis, Uber, Bolt, and tricycles (Keke NAPEP) are readily
                available around the city. Request for the <strong>University of Benin, Faculty of Law</strong> as your destination.
              </p>
            </div>
          </div>
        </div>

        {/* Conference info strip */}
        <div className="vn-strip">
          <div className="vn-strip__item">
            <span className="vn-strip__label">Dates</span>
            <span className="vn-strip__val">18th – 22nd October, 2026</span>
          </div>
          <div className="vn-strip__divider" />
          <div className="vn-strip__item">
            <span className="vn-strip__label">Venue</span>
            <span className="vn-strip__val">Faculty of Law, UNIBEN</span>
          </div>
          <div className="vn-strip__divider" />
          <div className="vn-strip__item">
            <span className="vn-strip__label">Nearest Airport</span>
            <span className="vn-strip__val">Benin Airport (BNI)</span>
          </div>
        </div>

      </div>
    </div>
    </>
  );
}