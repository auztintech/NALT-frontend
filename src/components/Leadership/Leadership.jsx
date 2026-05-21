import React, { useEffect, useRef } from "react";
import "./Leadership.css";
import { Link } from "react-router-dom";
import profAkintayo from "../../assets/images/profjohn2.jpg";
import DrEsa from "../../assets/images/dresa.png";
import DrNenna from "../../assets/images/drnnena.jpg";
import DrMoha from "../../assets/images/drmuhammed.jpg";
import DrAlao from "../../assets/images/Alao.jpg";
import Placeholder from "../../assets/images/placeholder.avif";



const leaders = [
  {
    name: "Prof. Oluwole Akintayo",
    role: "President",
    institution: "University of Ibadan",
    description:
      "Professor Akintayo serves as the President of the Nigerian Association of Law Teachers. A distinguished legal scholar at the University of Ibadan, he brings decades of academic leadership and a deep commitment to advancing legal education across Nigeria.",
    image: profAkintayo,
  },
  {
    name: "Dr. Esa Onoja",
    role: "General Secretary",
    institution: "Nigerian Law School, Abuja",
    description:
      "Dr. Onoja serves as General Secretary of NALT, coordinating the association's administrative functions from the Nigerian Law School, Abuja. He is known for his meticulous approach to governance and his passion for legal professional development.",
    image: DrEsa,
  },
  {
    name: "Dr. Nnena Eboh",
    role: "Treasurer",
    institution: "Nigerian Institute of Advanced Legal Studies",
    description:
      "Dr. Eboh oversees NALT's financial affairs with precision and integrity. Based at the Nigerian Institute of Advanced Legal Studies, she brings rigorous financial acumen and a strong record of academic contribution to her role.",
    image: DrNenna,
  },
  {
    name: "Dr. Mohammed Bashir Badr",
    role: "Financial Secretary",
    institution: "Nigerian Police Academy, Wudil",
    description:
      "Dr. Badr serves as Financial Secretary of NALT, supporting the association's financial management from the Nigerian Police Academy, Wudil. His work reflects a dedication to transparency and accountability in legal education governance.",
    image: DrMoha,
  },
  {
    name: "Dr. Paul Ikenna Ukam",
    role: "Assistant General Secretary",
    institution: "University of Nigeria, Nsukka",
    description:
      "Dr. Ukam assists in managing NALT's secretariat and operations, drawing on his academic grounding at the University of Nigeria, Nsukka. He is a committed advocate for collegiate engagement and legal scholarship.",
    image: Placeholder,
  },
  {
    name: "Mr. Idris Ibrahim Alao",
    role: "Publicity Secretary",
    institution: "Fountain University, Osogbo",
    description:
      "Mr. Alao manages NALT's communications and public profile as Publicity Secretary. A faculty member at Fountain University, Osogbo, he brings energy and creative vision to promoting the association's work nationwide.",
    image: DrAlao,
  },
];

const Leadership = () => {
  const headerRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    if (headerRef.current) observer.observe(headerRef.current);
    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="leadership">
      {/* Header */}
      <div className="leadership__header" ref={headerRef}>
        <p className="leadership__eyebrow">Our Leadership</p>
        <h2 className="leadership__heading">
          The People <span>Leading NALT</span>
        </h2>
        <p className="leadership__subtext">
          NALT is guided by a dedicated national executive committee of legal
          scholars and educators from across Nigeria's finest institutions.
        </p>
      </div>

      {/* Leaders list */}
      <div className="leadership__list">
        {leaders.map((leader, index) => (
          <div
            key={index}
            className={`leadership__item ${index % 2 === 0 ? "from-left" : "from-right"}`}
            ref={(el) => (cardRefs.current[index] = el)}
            style={{ transitionDelay: `${(index % 2) * 100}ms` }}
          >
            {/* Photo */}
            <div className="leadership__photo-wrap">
              <img
                src={leader.image}
                alt={leader.name}
                className="leadership__photo"
              />
              <div className="leadership__photo-overlay" />
            </div>

            {/* Info */}
            <div className="leadership__info">
              <span className="leadership__role">{leader.role}</span>
              <h3 className="leadership__name">{leader.name}</h3>
              <p className="leadership__institution">{leader.institution}</p>
              <div className="leadership__divider" />
              <p className="leadership__description">{leader.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="leadership__cta">
        <Link to="/about" className="leadership__btn">
          Learn More About NALT
        </Link>
      </div>
    </section>
  );
};

export default Leadership;
