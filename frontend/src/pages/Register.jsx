import React, { useState } from 'react';
import FormField from '../components/FormField';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';

const API_BASE = API_BASE_URL;

const Register = () => {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    const errors = {};
    // Name validation
    if (!formData.name.trim() || formData.name.length < 2) {
      errors.name = 'Name is required (min 2 characters)';
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Enter a valid email address';
    }
    // Password validation
    const password = formData.password;
    if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(password)) {
      errors.password = 'Password must contain an uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      errors.password = 'Password must contain a lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      errors.password = 'Password must contain a number';
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.password = 'Password must contain a special character';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
  };

  const [formErrors, setFormErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    const { name, email, password } = formData;
    const result = await register({ name, email, password });
    if (result) {
      toast.success('Registration successful! Please verify your email.');
      navigate('/login');
    } else {
      toast.error('Registration failed. Please try again.');
    }
  };

  const handleSocialRegister = (provider) => {
    if (provider === 'Google') {
      window.location.href = `${API_BASE}/auth/google`;
    }
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto mt-8 sm:mt-12 p-4 sm:p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-800">Register</h2>
      {error && <p className="text-red-500 mb-4 text-center font-semibold">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <FormField
          label="Name"
          name="name"
          value={formData.name}
          handleChange={handleChange}
          placeholder="John Doe"
          required
        />
        {formErrors.name && <p className="text-red-500 text-sm -mt-4 mb-4">{formErrors.name}</p>}
        <FormField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          handleChange={handleChange}
          placeholder="example@example.com"
          required
        />
        {formErrors.email && <p className="text-red-500 text-sm -mt-4 mb-4">{formErrors.email}</p>}
        <FormField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          handleChange={handleChange}
          placeholder="Enter your password"
          required
        />
        {formErrors.password && <p className="text-red-500 text-sm -mt-4 mb-4">{formErrors.password}</p>}
        <FormField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          handleChange={handleChange}
          placeholder="Confirm your password"
          required
        />
        {formErrors.confirmPassword && <p className="text-red-500 text-sm -mt-4 mb-4">{formErrors.confirmPassword}</p>}
        <div className="flex justify-center">
          <Button
            type="submit"
            text={loading ? 'Registering...' : 'Register'}
            disabled={loading}
          />
        </div>
      </form>
      <div className="mt-4 sm:mt-6 text-center">
        <span className="text-gray-500">Already have an account? </span>
        <Link to="/login" className="text-blue-600 hover:underline font-medium">
          Login
        </Link>
      </div>
      <div className="mt-6 sm:mt-8 text-center">
        <p className="mb-3 text-gray-500">Or register with</p>
        <div className="flex justify-center">
          <button
            onClick={() => handleSocialRegister('Google')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-7 py-2 rounded-lg shadow transition-all duration-200 font-semibold flex items-center gap-2"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48"><path fill="#4285F4" d="M24 9.5c3.54 0 6.73 1.22 9.24 3.22l6.93-6.93C36.16 2.34 30.4 0 24 0 14.61 0 6.4 5.61 2.44 13.78l8.06 6.27C12.36 13.16 17.74 9.5 24 9.5z" /><path fill="#34A853" d="M46.1 24.5c0-1.54-.14-3.03-.41-4.47H24v8.47h12.44c-.54 2.91-2.18 5.38-4.64 7.04l7.19 5.59C43.98 37.09 46.1 31.23 46.1 24.5z" /><path fill="#FBBC05" d="M10.5 28.05c-.6-1.77-.95-3.65-.95-5.55s.35-3.78.95-5.55l-8.06-6.27C.86 14.61 0 19.13 0 24s.86 9.39 2.44 13.78l8.06-6.27z" /><path fill="#EA4335" d="M24 48c6.4 0 12.16-2.34 16.17-6.39l-7.19-5.59c-2.01 1.35-4.59 2.15-8.98 2.15-6.26 0-11.64-3.66-13.5-8.55l-8.06 6.27C6.4 42.39 14.61 48 24 48z" /></svg>
            <span>Register with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
