import React, { useEffect, useRef } from "react";
import "./ConferenceBenefits.css";
import { Link } from "react-router-dom";

const benefits = [
  {
    icon: "",
    title: "World-Class Legal Scholarship",
    description:
      "Engage with cutting-edge research and presentations from leading law teachers, judges, and legal practitioners across Nigeria and beyond.",
  },
  {
    icon: "",
    title: "Professional Networking",
    description:
      "Connect with hundreds of law educators, researchers, and policymakers. Build relationships that advance your career and collaborative work.",
  },
  {
    icon: "",
    title: "Innovative Ideas & Discourse",
    description:
      "Participate in panel discussions, workshops, and debates that challenge conventional thinking and inspire new approaches to legal education.",
  },
  {
    icon: "",
    title: "Certificate of Participation",
    description:
      "Receive an official NALT certificate recognising your participation — a valuable addition to your academic and professional portfolio.",
  },
  {
    icon: "",
    title: "Access to Research & Publications",
    description:
      "Get exclusive access to conference papers, journals, and legal resources shared by presenters and participating institutions.",
  },
  {
    icon: "",
    title: "SDG-Aligned Conversations",
    description:
      "Be part of meaningful dialogue on how legal education can drive the Sustainable Development Goals forward in Nigeria and Africa.",
  },
  {
    icon: "",
    title: "Institutional Visibility",
    description:
      "Represent your law faculty or institution on a national stage, showcasing your contributions to legal education in Nigeria.",
  },
  {
    icon: "",
    title: "CPD & Academic Growth",
    description:
      "Earn Continuing Professional Development credits while deepening your expertise in emerging technologies and contemporary legal issues.",
  },
];

// In a 4-column grid:
// columns 0,1 (left half)  → slide in from left
// columns 2,3 (right half) → slide in from right
const getDirection = (index) => {
  const col = index % 4;
  return col < 2 ? "from-left" : "from-right";
};

const ConferenceBenefits = () => {
  const headerRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const options = {
      threshold: 0.15,
      rootMargin: "0px 0px -60px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          observer.unobserve(entry.target);
        }
      });
    }, options);

    if (headerRef.current) observer.observe(headerRef.current);
    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="benefits">
      {/* Header */}
      <div className="benefits__header" ref={headerRef}>
        <p className="benefits__eyebrow">Why Attend</p>
        <h2 className="benefits__heading">
          What You Gain at the <span>57th NALT Conference</span>
        </h2>
        <p className="benefits__subtext">
          The NALT Annual Conference is more than an academic gathering — it is
          a transformative experience for every law educator committed to
          excellence.
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="benefits__grid">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className={`benefits__card ${getDirection(index)}`}
            ref={(el) => (cardRefs.current[index] = el)}
            style={{ transitionDelay: `${(index % 4) * 100}ms` }}
          >
            <div className="benefits__card-icon">{benefit.icon}</div>
            <h3 className="benefits__card-title">{benefit.title}</h3>
            <p className="benefits__card-desc">{benefit.description}</p>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="benefits__cta-wrap">
        <p className="benefits__cta-text">
          Ready to be part of this historic conference?
        </p>
        <div className="benefits__cta-actions">
          <Link to="/register" className="benefits__btn primary">
            Register Now
          </Link>
          <Link to="/about" className="benefits__btn secondary">
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ConferenceBenefits;