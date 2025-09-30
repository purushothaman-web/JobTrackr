import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GoogleAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const name = params.get('name');
    const email = params.get('email');

    if (token && name && email) {
      const user = {
        name,
        email,
        token,
        emailVerified: true,
      };
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      // Optionally set default Authorization header for future requests
      // import { api } from '../context/AuthContext'; and set: api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      navigate('/jobs');
    } else {
      navigate('/login');
    }
  }, [location, setUser, navigate]);

  return (
    <div className="text-center mt-20">
      <p>Processing login with Google... Please wait.</p>
    </div>
  );
};

export default GoogleAuthCallback;
