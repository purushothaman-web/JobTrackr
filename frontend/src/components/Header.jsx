import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import { cn } from '../lib/utils';

const navItems = [
  { href: '/jobs', label: 'JOBS' },
  { href: '/companies', label: 'COMPANIES' },
  { href: '/interviews', label: 'INTERVIEWS' },
  { href: '/import', label: 'IMPORT' },
];

const Header = () => {
  const { user, logout, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = location.pathname;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="top-0 w-full z-50 bg-obsidian/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        
        {/* Logo / Brand */}
        <Link 
          to={user ? '/jobs' : '/'} 
          className="flex items-center gap-2 group focus:outline-none"
        >
          <div className="w-8 h-8 bg-electric text-obsidian flex items-center justify-center font-heading font-black text-xl leading-none transition-transform group-hover:scale-105">
            J
          </div>
          <span className="font-heading font-bold text-xl tracking-tight text-offwhite group-hover:text-electric transition-colors">
            TRACKR
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {!loading && user ? (
            <>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "text-xs font-mono tracking-widest transition-colors focus:outline-none rounded-sm focus-visible:ring-2 focus-visible:ring-electric",
                    isActive(item.href) ? "text-electric" : "text-zinc-400 hover:text-offwhite"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-border">
                <Link to="/add-job" className="focus:outline-none">
                  <Button variant="primary" size="sm">Add Job</Button>
                </Link>
                <Link 
                  to="/profile" 
                  className={cn(
                    "text-xs font-mono tracking-widest transition-colors focus:outline-none rounded-sm focus-visible:ring-2 focus-visible:ring-electric",
                    isActive('/profile') ? "text-electric" : "text-zinc-400 hover:text-offwhite"
                  )}
                >
                  PROFILE
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="text-xs font-mono tracking-widest text-zinc-400 hover:text-red-400 transition-colors focus:outline-none rounded-sm focus-visible:ring-2 focus-visible:ring-red-400"
                >
                  LOGOUT
                </button>
              </div>
            </>
          ) : !loading && (
            <div className="flex items-center gap-4">
              <Link to="/" className="focus:outline-none">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register" className="focus:outline-none">
                <Button variant="secondary" size="sm">Register</Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-zinc-400 hover:text-offwhite transition-colors p-2 focus:outline-none rounded-sm focus-visible:ring-2 focus-visible:ring-electric"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ) : (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-obsidian-light border-b border-border"
          >
            <div className="flex flex-col px-6 py-4 space-y-4">
              {!loading && user ? (
                <>
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "text-sm font-mono tracking-widest transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-electric",
                        isActive(item.href) ? "text-electric" : "text-zinc-400 hover:text-offwhite"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="pt-4 border-t border-border flex flex-col space-y-4">
                    <Link to="/add-job" onClick={() => setMenuOpen(false)} className="focus:outline-none">
                      <Button variant="primary" className="w-full">Add Job</Button>
                    </Link>
                    <Link 
                      to="/profile" 
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "text-sm font-mono tracking-widest focus:outline-none focus-visible:ring-2 focus-visible:ring-electric",
                        isActive('/profile') ? "text-electric" : "text-zinc-400 hover:text-offwhite"
                      )}
                    >
                      PROFILE
                    </Link>
                    <button 
                      onClick={() => { handleLogout(); setMenuOpen(false); }} 
                      className="text-left text-sm font-mono tracking-widest text-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                    >
                      LOGOUT
                    </button>
                  </div>
                </>
              ) : !loading && (
                <div className="flex flex-col space-y-4">
                  <Link to="/" onClick={() => setMenuOpen(false)} className="focus:outline-none">
                    <Button variant="secondary" className="w-full">Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="focus:outline-none">
                    <Button variant="primary" className="w-full">Register</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
