import './App.css';
import './Login.css';
import './About.css';
import Navbar from './components/Navbar';

function About() {
  return (
    <>
      <Navbar />
      <div className="logo-container">
        <img
          className="logopic"
          src="/img/gatortradertransparent.png"
          alt="Gator Trader Logo"
        />
        <p className="logostuff">About Us...</p>
      </div>

      <div className="about-container">
        {/* Our Story Section */}
        <h2>Our Story</h2>
        <div className="story-section">
          <p>
            Gator Trader was created to empower investors with real-time market insights and cutting-edge analytics. Our mission is to bridge the gap between data and decision-making, offering an intuitive platform that helps both novices and professionals navigate the complexities of the stock market.
          </p>
        </div>

        {/* Our Team Section */}
        <h2>Our Team</h2>
        <div className="developer-section">
          <div className="developer-card">
            <img
              src="/img/AboutUsPictures/Hiral_Shuklas_Headshot (1).jpg"
              alt="Hiral Shukla"
              className="developer-image"
            />
            <h3>Hiral Shukla</h3>
            <p>placeholder</p>
          </div>
          <div className="developer-card">
            <img
              src="/img/AboutUS/paigevanoverheadshot.jpg"
              alt="Paige Vanover"
              className="developer-image"
            />
            <h3>Paige Vanover</h3>
            <p>placeholder</p>
          </div>
          <div className="developer-card">
            <img
              src="/img/AboutUsPictures/placeholder_image3.jpg"
              alt="Josh"
              className="developer-image"
            />
            <h3>Josh</h3>
            <p>placeholder</p>
          </div>
          <div className="developer-card">
            <img
              src="/img/AboutUsPictures/ShunmukaValsaHeadshot.jpg"
              alt="Shunmuka Valsa"
              className="developer-image"
            />
            <h3>Shunmuka Valsa</h3>
            <p>placeholder</p>
          </div>
        </div>
      </div>

      <div className="footer-bar"></div>
    </>
  );
}

export default About;
