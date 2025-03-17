// About.js
import './App.css';
import './Login.css';
import './About.css';
import paige from "../public/AboutUS/paigevanoverheadshot.jpg"
import Navbar from './components/Navbar';

function About() {
  return (
    <html>

      <head>
        <title>About Us - Gator Trader</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=K2D:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navbar />
        <div className="logo-container">
          <img
            className="logopic"
            src="../img/gatortradertransparent.png"
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
                src="\img\AboutUsPictures\Hiral_Shuklas_Headshot (1).jpg"
                alt="Developer 1"
                className="developer-image"
              />
              <h3>Hiral Shukla</h3>
              <p>placeholder</p>
            </div>
            <div className="developer-card">
              <img
                src={paige}
                alt="Developer 2"
                className="developer-image"
              />
              <h3>Paige Vanover</h3>
              <p>placeholder</p>
            </div>
            <div className="developer-card">
              <img
                src="path_to_placeholder_image3.jpg"
                alt="Developer 3"
                className="developer-image"
              />
              <h3>Josh</h3>
              <p>placeholder</p>

            </div>
            <div className="developer-card">
              <img
                src="\img\AboutUsPictures\ShunmukaValsaHeadshot.jpg"
                alt="Developer 4"
                className="developer-image"
              />
              <h3>Shunmuka Valsa</h3>
              <p>placeholder</p>
            </div>
          </div>
        </div>

        <div className="footer-bar"></div>
      </body>
    </html>
  );
}

export default About;
