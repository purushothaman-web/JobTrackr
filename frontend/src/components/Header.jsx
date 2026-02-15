import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import logo from '../assets/logo.svg';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Responsive menu state
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header className="glass-header">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link to={user ? "/jobs" : "/"} className="flex items-center gap-3 group">
          <img src={logo} alt="JobTrackr Logo" className="h-10 w-10 transition-transform group-hover:scale-110" />
          <span className="text-2xl font-extrabold tracking-tight text-gradient">
            JobTrackr
          </span>
        </Link>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden p-2 text-slate-600 hover:text-violet-600 transition-colors bg-slate-100 rounded-lg"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {user ? (
            <>
              <Link to="/jobs" className="text-slate-600 font-medium hover:text-violet-600 transition-colors">Jobs</Link>
              <Link to="/add-job" className="text-slate-600 font-medium hover:text-violet-600 transition-colors">Add Job</Link>
              <Link to="/companies" className="text-slate-600 font-medium hover:text-violet-600 transition-colors">Companies</Link>
              <Link to="/interviews" className="text-slate-600 font-medium hover:text-violet-600 transition-colors">Interviews</Link>
              <Link to="/import" className="text-slate-600 font-medium hover:text-violet-600 transition-colors">Import</Link>
              <Link to="/profile" className="text-slate-600 font-medium hover:text-violet-600 transition-colors">Profile</Link>
              <button onClick={handleLogout} className="btn-primary py-2 px-5 text-sm shadow-md">Logout</button>
            </>
          ) : (
            <>
              <Link to="/" className="text-slate-600 font-medium hover:text-violet-600 transition-colors">Login</Link>
              <Link to="/register" className="btn-primary py-2 px-5 text-sm shadow-md">Register</Link>
            </>
          )}
        </nav>

        {/* Mobile nav */}
        {menuOpen && (
          <nav className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-xl flex flex-col items-center py-6 space-y-6 z-40 md:hidden animate-in slide-in-from-top-2 fade-in duration-200">
            {user ? (
              <>
                <Link to="/jobs" className="text-lg text-slate-700 font-semibold hover:text-violet-600" onClick={() => setMenuOpen(false)}>Jobs</Link>
                <Link to="/add-job" className="text-lg text-slate-700 font-semibold hover:text-violet-600" onClick={() => setMenuOpen(false)}>Add Job</Link>
                <Link to="/companies" className="text-lg text-slate-700 font-semibold hover:text-violet-600" onClick={() => setMenuOpen(false)}>Companies</Link>
                <Link to="/interviews" className="text-lg text-slate-700 font-semibold hover:text-violet-600" onClick={() => setMenuOpen(false)}>Interviews</Link>
                <Link to="/import" className="text-lg text-slate-700 font-semibold hover:text-violet-600" onClick={() => setMenuOpen(false)}>Import</Link>
                <Link to="/profile" className="text-lg text-slate-700 font-semibold hover:text-violet-600" onClick={() => setMenuOpen(false)}>Profile</Link>
                <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="btn-primary w-3/4 text-center">Logout</button>
              </>
            ) : (
              <>
                <Link to="/" className="text-lg text-slate-700 font-semibold hover:text-violet-600" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="btn-primary w-3/4 text-center" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
