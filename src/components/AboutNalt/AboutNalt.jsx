import React from "react";
import "./AboutNalt.css";
import { Link } from "react-router-dom";
import naltImage from "../../assets/images/nalt.jpeg";

const stats = [
  { value: "500+", label: "Law Teachers" },
  { value: "30+", label: "Years of Service" },
  { value: "36", label: "States Represented" },
  { value: "100+", label: "Partner Institutions" },
];

const AboutNalt = () => {
  return (
    <section className="homeabout">
      {/* Image Column */}
      <div className="homeabout__image-col">
        <div className="homeabout__image-wrapper">
          <img src={naltImage} alt="NALT members at a conference" />
          {/* Floating badge */}
          <div className="homeabout__badge">
            <span className="badge-number">1961</span>
            <span className="badge-text">Est.</span>
          </div>
        </div>
      </div>

      {/* Text Column */}
      <div className="homeabout__text-col">
        <p className="homeabout__eyebrow">Who We Are</p>
        <h2 className="homeabout__heading">
          Nigeria's Leading Body for <span>Law Educators</span>
        </h2>
        <p className="homeabout__body">
          The Nigerian Association of Law Teachers (NALT) is a professional body
          representing the interests of law teachers across Nigeria. We are
          committed to promoting excellence in legal education, fostering
          scholarly research, and building a vibrant community of legal minds.
        </p>
        <p className="homeabout__body">
          Through conferences, publications, and collaborative initiatives, NALT
          continues to shape the future of legal scholarship and raise the
          standard of law teaching at every level.
        </p>

        {/* Stats */}
        <div className="homeabout__stats">
          {stats.map((stat) => (
            <div key={stat.label} className="homeabout__stat">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="homeabout__actions">
          <Link to="/about" className="homeabout__btn primary">
            Learn More About NALT
          </Link>
          <Link to="/contact" className="homeabout__btn secondary">
            Get in Touch
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutNalt;