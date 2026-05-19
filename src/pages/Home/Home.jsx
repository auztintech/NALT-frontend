import React from "react";
import Header from "../../components/Header/Header";
import Hero from "../../components/Hero/Hero";
import AboutNalt from "../../components/AboutNalt/AboutNalt";
import ConferenceHighlight from "../../components/ConferenceHighlight/ConferenceHighlight";
import ConferenceBenefits from "../../components/ConferenceBenefits/ConferenceBenefits";

const Home = () => {
  return (
    <div>
      <Header />
      <Hero />
      <AboutNalt />
      <ConferenceHighlight />
      <ConferenceBenefits />
    </div>
  );
};

export default Home;
