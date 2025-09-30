// src/App.jsx
import React from 'react';
import AppRoutes from './routes/AppRoutes';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <AppRoutes />
        <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} pauseOnHover theme="light" />
      </main>
      <Footer />
    </div>
  );
}

export default App;
