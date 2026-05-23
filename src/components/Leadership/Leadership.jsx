import React, { useEffect, useRef } from "react";
import "./Leadership.css";
import { Link } from "react-router-dom";
import profAkintayo from "../../assets/images/profjohn22.jpg";
import DrEsa from "../../assets/images/dresa.png";
import DrNenna from "../../assets/images/drnnena.jpg";
import DrMoha from "../../assets/images/drmuhammed.jpg";
import DrAlao from "../../assets/images/Alao.jpg";
import Placeholder from "../../assets/images/placeholder.avif";

const leaders = [
  {
    number: "01",
    name: "Prof. Oluwole Akintayo",
    role: "President",
    institution: "University of Ibadan",
    description:
      "Professor Akintayo serves as the President of the Nigerian Association of Law Teachers. A distinguished legal scholar at the University of Ibadan, he brings decades of academic leadership and a deep commitment to advancing legal education across Nigeria.",

    image: profAkintayo,
  },
  {
    number: "02",
    name: "Dr. Esa Onoja",
    role: "General Secretary",
    institution: "Nigerian Law School, Abuja",
    description:
      "Dr. Onoja coordinates the association's administrative functions from the Nigerian Law School, Abuja. He is known for his meticulous approach to governance and his passion for legal professional development.",

    image: DrEsa,
  },
  {
    number: "03",
    name: "Dr. Nnena Eboh",
    role: "Treasurer",
    institution: "Nigerian Institute of Advanced Legal Studies",
    description:
      "Dr. Eboh oversees NALT's financial affairs with precision and integrity. Based at the Nigerian Institute of Advanced Legal Studies, she brings rigorous financial acumen and a strong record of academic contribution.",

    image: DrNenna,
  },
  {
    number: "04",
    name: "Dr. Mohammed Bashir Badr",
    role: "Financial Secretary",
    institution: "Nigerian Police Academy, Wudil",
    description:
      "Dr. Badr supports NALT's financial management from the Nigerian Police Academy, Wudil. His work reflects a strong dedication to transparency and accountability in legal education governance.",

    image: DrMoha,
  },
  {
    number: "05",
    name: "Dr. Paul Ikenna Ukam",
    role: "Assistant General Secretary",
    institution: "University of Nigeria, Nsukka",
    description:
      "Dr. Ukam assists in managing NALT's secretariat and operations, drawing on his academic grounding at the University of Nigeria, Nsukka. He is a committed advocate for collegiate engagement and legal scholarship.",

    image: Placeholder,
  },
  {
    number: "06",
    name: "Mr. Idris Ibrahim Alao",
    role: "Publicity Secretary",
    institution: "Fountain University, Osogbo",
    description:
      "Mr. Alao manages NALT's communications and public profile as Publicity Secretary. A faculty member at Fountain University, Osogbo, he brings energy and creative vision to promoting the association's work nationwide.",

    image: DrAlao,
  },
];

const Leadership = () => {
  return (
    <section className="leadership">
      {/* Header */}
      <div className="leadership__header">
        <p className="leadership__eyebrow">Our Leadership</p>
        <h2 className="leadership__heading">
          The People <span>Leading NALT</span>
        </h2>
        <p className="leadership__subtext">
          NALT is guided by a dedicated national executive committee of legal
          scholars and educators from across Nigeria's finest institutions.
        </p>
      </div>

      {/* Sticky stack */}
      <div className="leadership__stack">
        {leaders.map((leader, index) => (
          <div
            className="leadership__card"
            key={index}
            style={{ top: `calc(80px + ${index * 24}px)` }}
          >
            {/* Number */}
            <div className="leadership__number">{leader.number}</div>

            {/* Left — text */}
            <div className="leadership__info">
              <span className="leadership__role-badge">{leader.role}</span>
              <h3 className="leadership__name">{leader.name}</h3>
              <p className="leadership__institution">{leader.institution}</p>
              <div className="leadership__divider" />
              <p className="leadership__description">{leader.description}</p>
            </div>

            {/* Right — photo */}
            <div className="leadership__photo-wrap">
              <img
                src={leader.image}
                alt={leader.name}
                className="leadership__photo"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Leadership;
