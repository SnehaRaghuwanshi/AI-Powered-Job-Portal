import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const active = (path) => location.pathname === path ? 'active' : '';

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">Talent<span>AI</span></Link>
      <div className="nav-links">
        <Link to="/" className={active('/')}>Jobs</Link>
        {user?.role === 'recruiter' && <>
          <Link to="/screener"  className={active('/screener')}>AI Screener</Link>
          <Link to="/post-job"  className={active('/post-job')}>Post Job</Link>
        </>}
        {user ? <>
          <Link to="/dashboard" className={active('/dashboard')}>Dashboard</Link>
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
        </> : <>
          <Link to="/login"    className={active('/login')}>Login</Link>
          <Link to="/register">
            <button className="btn btn-primary btn-sm">Sign Up</button>
          </Link>
        </>}
      </div>
    </nav>
  );
}
