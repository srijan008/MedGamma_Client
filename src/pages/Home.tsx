import { Link } from 'react-router-dom';
import '../App.css';

export default function Home() {
  return (
    <div className="home-container">
      <div className="hero-content">
        <h1>Welcome to <span className="highlight">Botify</span></h1>
        <p>Experience the next generation of AI conversation. Intelligent, responsive, and always ready to help.</p>
        <div className="hero-actions">
          <Link to="/chat" className="cta-button">Get Started</Link>
          <a href="#" className="secondary-button">Learn More</a>
        </div>
      </div>
    </div>
  );
}