import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useChatStore } from '../store/chatStore';
import '../App.css';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { createNewChat } = useChatStore();

  // const handleNewChat = async () => {
  //   if (window.confirm("Start a new chat? This will clear the current session view.")) {
  //     console.log("new chat");
  //       await createNewChat();
  //       navigate('/chat');
  //   }
  // };

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
