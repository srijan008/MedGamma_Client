import { Link, useLocation } from 'react-router-dom';
import '../App.css';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" className="brand-link">
           <div className="brand-logo">AI</div>
           <span>Botify</span>
        </Link>
      </div>
      <div className="nav-links">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          Home
        </Link>
        <Link to="/chat" className={`nav-link ${location.pathname === '/chat' ? 'active' : ''}`}>
          Chat
        </Link>
      </div>
    </nav>
  );
}
