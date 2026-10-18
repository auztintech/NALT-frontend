import ConferencePaperList from "../../components/ConferencePaperList/ConferencePaperList";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

export default function PaperList() {
  return (
    <div>
      <Header />
      <ConferencePaperList />
      <Footer />
    </div>
  );
}