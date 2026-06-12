import React, { useState, useEffect } from "react";
import "./Hero.css";
import { Link } from "react-router-dom";
import heroImage2 from "../../assets/images/Faculty.jpg";
import unibenimage from "../../assets/images/uniben.webp";

const slides = [
  {
    tagline: "Excellence in Legal Education",
    heading: "Shaping the Future",
    subheading: "of Law Teaching",
    description:
      "Join Nigeria's foremost community of law educators committed to raising the standard of legal scholarship.",
    image:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=80",
  },
  {
    tagline: "Annual Conference 2025",
    heading: "Advancing Legal",
    subheading: "Scholarship Together",
    description:
      "Connect with leading law teachers, researchers, and practitioners from across the country.",
    image: heroImage2,
  },
  {
    tagline: "Knowledge & Community",
    heading: "Empowering Law",
    subheading: "Educators Nationwide",
    description:
      "Access resources, research, and a strong network dedicated to excellence in legal education.",
    image: unibenimage,
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [textVisible, setTextVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Slide text out
      setTextVisible(false);
      setAnimating(true);

      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setTextVisible(true);
        setAnimating(false);
      }, 600);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goTo = (index) => {
    if (index === current) return;
    setTextVisible(false);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setTextVisible(true);
      setAnimating(false);
    }, 600);
  };

  const slide = slides[current];

  return (
    <section className="nalt-hero">
      {/* Background images with crossfade */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`nalt-hero__bg ${i === current ? "active" : ""}`}
          style={{ backgroundImage: `url(${s.image})` }}
        />
      ))}

      {/* Purple overlay */}
      <div className="nalt-hero__overlay" />

      {/* Content */}
      <div
        className={`nalt-hero__content ${textVisible ? "slide-in" : "slide-out"}`}
      >
        <p className="nalt-hero__tagline">{slide.tagline}</p>
        <h1 className="nalt-hero__heading">
          {slide.heading}
          <br />
          <span>{slide.subheading}</span>
        </h1>
        <p className="nalt-hero__description">{slide.description}</p>

        <div className="nalt-hero__actions">
          <Link to="/register" className="nalt-hero__btn primary">
            Register Now
          </Link>
          <Link to="/about" className="nalt-hero__btn secondary">
            Learn More
          </Link>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="nalt-hero__dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`nalt-hero__dot ${i === current ? "active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Event bar */}
      <div className="nalt-hero__eventbar">
        <div className="nalt-hero__eventbar-inner">
          <span className="eventbar-label">Next Event:</span>
          <span className="eventbar-value">
            18 - 22 October, 2026 &nbsp;·&nbsp; Benin, Nigeria
          </span>
          <Link to="/contact" className="eventbar-cta"></Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
