import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home";
import Articles from "./pages/Articles/Articles";
import ArticleDetail from "./pages/Articles/ArticleDetail";
import Announcements from "./pages/Announcement/Announcements";
import AnnouncementDetail from "./pages/Announcement/AnnouncementDetail";
import Contact from "./pages/Contact/Contact";
import About from "./pages/About/About";
import Register from "./pages/Register/Register";
import Conferenceschedule from "./pages/Conferenceschedule/Conferenceschedule";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MembershipFees from "./pages/Membership/MembershipFees";
import Venue from "./pages/Venue/Venue";
import Hotels from "./pages/Hotels/Hotels";
import Papers from "./pages/Papers/Papers";
import ScrollToTop from "./components/ScrollTop/ScrollTop";



function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/announcements/:slug" element={<AnnouncementDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/conference/schedule" element={<Conferenceschedule />} />
          <Route path="/membership/fees" element={<MembershipFees />} />
          <Route path="/logistics/venue" element={<Venue />} />
          <Route path="/logistics/hotels" element={<Hotels />} />
          <Route path="/papers" element={<Papers />} />

        </Routes>
        </ScrollToTop>
      </BrowserRouter>
    </>
  );
}

export default App;