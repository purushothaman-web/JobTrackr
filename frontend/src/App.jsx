// src/App.jsx
import React from 'react';
import AppRoutes from './routes/AppRoutes';
import Header from './components/Header';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="antialiased font-body bg-obsidian text-offwhite min-h-screen flex flex-col selection:bg-electric selection:text-obsidian">
      <Header />
      <main className="flex-grow page-shell pt-32 pb-16">
        <AppRoutes />
        <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} pauseOnHover theme="dark" />
      </main>

    </div>
  );
}

export default App;
