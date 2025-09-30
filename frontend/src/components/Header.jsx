import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
    <header className="bg-[#F9FAFB] shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link to={user ? "/jobs" : "/"} className="text-2xl font-bold font-heading text-[#1E293B] hover:text-[#3B82F6] transition-colors">
          JobTrackr
        </Link>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden flex items-center px-2 py-1 border rounded text-[#3B82F6] border-[#3B82F6]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-6 text-[#64748B] font-body">
          {user ? (
            <>
              <Link to="/jobs" className="hover:text-[#3B82F6] font-medium transition-colors">Jobs</Link>
              <Link to="/add-job" className="hover:text-[#3B82F6] font-medium transition-colors">Add Job</Link>
              <Link to="/profile" className="hover:text-[#3B82F6] font-medium transition-colors">Profile</Link>
              <button onClick={handleLogout} className="ml-4 px-4 py-1 bg-[#3B82F6] text-white rounded-md hover:bg-[#2563EB] transition-colors">Logout</button>
            </>
          ) : (
            <>
              <Link to="/" className="hover:text-[#3B82F6] font-medium transition-colors">Login</Link>
              <Link to="/register" className="hover:text-[#3B82F6] font-medium transition-colors">Register</Link>
            </>
          )}
        </nav>

        {/* Mobile nav */}
        {menuOpen && (
          <nav className="absolute top-16 left-0 w-full bg-[#F9FAFB] shadow-md flex flex-col items-center py-4 space-y-4 z-50 md:hidden text-[#64748B] font-body">
            {user ? (
              <>
                <Link to="/jobs" className="hover:text-[#3B82F6] font-medium transition-colors" onClick={() => setMenuOpen(false)}>Jobs</Link>
                <Link to="/add-job" className="hover:text-[#3B82F6] font-medium transition-colors" onClick={() => setMenuOpen(false)}>Add Job</Link>
                <Link to="/profile" className="hover:text-[#3B82F6] font-medium transition-colors" onClick={() => setMenuOpen(false)}>Profile</Link>
                <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="px-4 py-1 bg-[#3B82F6] text-white rounded-md hover:bg-[#2563EB] transition-colors">Logout</button>
              </>
            ) : (
              <>
                <Link to="/" className="hover:text-[#3B82F6] font-medium transition-colors" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="hover:text-[#3B82F6] font-medium transition-colors" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
