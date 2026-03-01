import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg bg-obsidian-light border border-border p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-electric" />
        
        <h1 className="font-heading text-8xl font-black text-offwhite tracking-tighter uppercase mb-2">
          404<span className="text-red-500">_</span>
        </h1>
        
        <p className="font-mono text-electric text-sm tracking-widest uppercase mb-6 border-b border-border/50 pb-6 inline-block">
          Sector Not Found
        </p>
        
        <div className="font-mono text-zinc-400 text-xs sm:text-sm leading-relaxed mb-10">
          <p>The requested destination matrix does not exist.</p>
          <p className="mt-2 text-zinc-500">Verify coordinates or return to base.</p>
        </div>
        
        <Link to="/">
          <Button variant="primary" className="w-full sm:w-auto uppercase tracking-widest font-black">
            Return to Core
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
