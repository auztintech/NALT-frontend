import React from "react";
import Header from "../../components/Header/Header";
import Hero from "../../components/Hero/Hero";
import AboutNalt from "../../components/AboutNalt/AboutNalt";
import ConferenceHighlight from "../../components/ConferenceHighlight/ConferenceHighlight";

const Home = () => {
  return (
    <div>
      <Header />
      <Hero />
      <AboutNalt />
      <ConferenceHighlight />
    </div>
  );
};

export default Home;
