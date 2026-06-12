import React, { useState, useEffect } from "react";
import "./ConferenceHighlight.css";
import { Link } from "react-router-dom";

const CONFERENCE_DATE = new Date("2026-10-18T09:00:00");

const getTimeLeft = () => {
  const now = new Date();
  const diff = CONFERENCE_DATE - now;

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

const ConferenceHighlight = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <section className="conf">
      {/* Left — main info */}
      <div className="conf__main">
        <p className="conf__eyebrow">Upcoming Conference</p>

        <div className="conf__edition">
          <span className="conf__number">57</span>
          <sup className="conf__sup">th</sup>
          <span className="conf__national">National Conference</span>
        </div>

        <h2 className="conf__title">NALT to Remember</h2>

        <div className="conf__theme-box">
          <span className="conf__theme-label">Theme</span>
          <p className="conf__theme-text">
            Legal Education, Emerging Technologies and the Challenges of the
            Sustainable Development Goals
          </p>
        </div>

        <div className="conf__meta">
          <div className="conf__meta-item">
            <span className="conf__meta-icon"></span>
            <div>
              <span className="conf__meta-label">Date</span>
              <span className="conf__meta-value">18 – 22 October, 2026</span>
            </div>
          </div>
          <div className="conf__meta-item">
            <span className="conf__meta-icon"></span>
            <div>
              <span className="conf__meta-label">Venue</span>
              <span className="conf__meta-value">
                Faculty of Law, University of Benin, Benin City, Edo State
              </span>
            </div>
          </div>
          <div className="conf__meta-item">
            <span className="conf__meta-icon"></span>
            <div>
              <span className="conf__meta-label">Host</span>
              <span className="conf__meta-value">
                Faculty of Law, University of Benin (UNIBEN)
              </span>
            </div>
          </div>
        </div>

        
      </div>

      {/* Right — countdown + promo */}
      <div className="conf__sidebar">
        {/* Countdown */}
        <div className="conf__countdown">
          <p className="conf__countdown-title">Conference Begins In</p>
          <div className="conf__countdown-grid">
            {[
              { value: pad(timeLeft.days), label: "Days" },
              { value: pad(timeLeft.hours), label: "Hours" },
              { value: pad(timeLeft.minutes), label: "Mins" },
              { value: pad(timeLeft.seconds), label: "Secs" },
            ].map((item) => (
              <div key={item.label} className="conf__countdown-unit">
                <span className="conf__countdown-value">{item.value}</span>
                <span className="conf__countdown-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Early bird promo */}
        <div className="conf__promo">
          <div className="conf__promo-badge">Early Bird Offer</div>
          <p className="conf__promo-headline">
            First <strong>100</strong> Registrants
          </p>
          <p className="conf__promo-sub">
            Get a <strong>Special Prize</strong>
          </p>
          
        </div>
      </div>
    </section>
  );
};

export default ConferenceHighlight;