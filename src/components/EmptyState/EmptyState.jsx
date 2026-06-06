/* EmptyState.jsx
   Place this at: src/components/EmptyState/EmptyState.jsx
   Import into Articles.jsx and Announcements.jsx
*/

import "./EmptyState.css";

const EmptyState = ({ type = "articles" }) => {
  const isAnnouncement = type === "announcements";

  return (
    <div className="es-wrap">
      {/* Decorative rule top */}
      <div className="es-rule-top" />

      <div className="es-inner">
        {/* Left — conference identity block */}
        <div className="es-identity">
          <p className="es-edition">57th National Conference</p>
          <h2 className="es-conf-name">
            NALT <em>Uniben</em>
          </h2>
          <p className="es-tagline">— A NALT to Remember —</p>

          <div className="es-detail-list">
            <div className="es-detail-row">
              <span className="es-detail-label">Theme</span>
              <span className="es-detail-value">
                Legal Education, Emerging Technologies and the Challenges of the
                Sustainable Development Goals
              </span>
            </div>
            <div className="es-detail-row">
              <span className="es-detail-label">Date</span>
              <span className="es-detail-value">18 – 22 October, 2026</span>
            </div>
            <div className="es-detail-row">
              <span className="es-detail-label">Venue</span>
              <span className="es-detail-value">
                Faculty of Law, University of Benin, Benin City, Edo State
              </span>
            </div>
            <div className="es-detail-row">
              <span className="es-detail-label">Host</span>
              <span className="es-detail-value">
                Nigerian Association of Law Teachers (NALT)
              </span>
            </div>
          </div>

          <a href="/register" className="es-register-cta">
            Secure Your Spot — Register Now
          </a>
        </div>

        {/* Right — coming soon message */}
        <div className="es-message">
          <div className="es-message-inner">
            <span className="es-coming-label">Coming Soon</span>
            <h3 className="es-message-title">
              {isAnnouncement
                ? "Official notices will appear here"
                : "Scholarly contributions will appear here"}
            </h3>
            <p className="es-message-body">
              {isAnnouncement
                ? "The NALT Secretariat will publish conference announcements, programme updates, registration notices and official communications on this page ahead of the 57th National Conference."
                : "Peer-reviewed articles from law educators across Nigeria on legal education, emerging technologies and the sustainable development goals will be published here as submissions are received and reviewed."}
            </p>

            <div className="es-divider" />

            <p className="es-check-back">
              {isAnnouncement
                ? "Check back regularly for updates from the Organising Committee."
                : "Submissions open to all registered NALT members and invited scholars."}
            </p>

            <div className="es-early-bird">
              <div className="es-eb-badge">
                <span className="es-eb-number">100</span>
                <span className="es-eb-label">Early Bird</span>
              </div>
              <p className="es-eb-text">
                The first <strong>100 registrants</strong> get a special
                conference price. Register early and save more.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom rule */}
      <div className="es-rule-bottom" />
    </div>
  );
};

export default EmptyState;
