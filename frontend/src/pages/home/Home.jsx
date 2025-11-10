import Hero from './Hero.jsx';
import Services from './Services.jsx';
import About from './About.jsx';
import Contact from './Contact.jsx';
import Footer from '../../components/layout/Footer';

const Home = () => {
  return (
    <main>
      <Hero />
      <Services />
      <About />
      <Contact />
      <Footer />
    </main>
  );
};

export default Home;
