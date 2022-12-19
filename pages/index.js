import About from "../components-user/About";
import Footer from "../components-user/Footer";
import Info from "../components-user/Info";
import Jumbotron from "../components-user/Jumbotron";
import Kontak from "../components-user/Kontak";
import MainMenu from "../components-user/MainMenu";
import MainNav from "../components-user/MainNav";

export default function Home() {
  return (
    <>
      <MainNav />
      <Jumbotron />
      <MainMenu />
      <About />
      <Kontak />
      <Info />
      <Footer />
    </>
  );
}
