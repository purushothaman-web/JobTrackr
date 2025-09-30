// src/pages/ErrorPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = ({ message = "Something went wrong." }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-2">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6 text-red-600">Error</h1>
        <p className="mb-8 text-lg text-gray-700">{message}</p>
        <Link
          to="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-lg transition"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
