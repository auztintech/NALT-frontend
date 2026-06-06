import React from "react";
import Header from "../../components/Header/Header";
import Hero from "../../components/Hero/Hero";
import AboutNalt from "../../components/AboutNalt/AboutNalt";
import ConferenceHighlight from "../../components/ConferenceHighlight/ConferenceHighlight";
import ConferenceBenefits from "../../components/ConferenceBenefits/ConferenceBenefits";
import Leadership from "../../components/Leadership/Leadership";
import ArticlesTicker from "../../components/ArticlesTicker/ArticlesTicker";

const Home = () => {
  return (
    <div>
      <Header />
      <Hero />
      <AboutNalt />
      <ConferenceHighlight />
      <ConferenceBenefits />
      <ArticlesTicker />
      <Leadership />
    </div>
  );
};

export default Home;