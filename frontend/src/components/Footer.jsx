import React from 'react';


const Footer = () => {
  return (
    <footer className="bg-[#F9FAFB] border-t border-[#64748B] py-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        <p className="text-[#64748B] text-sm mb-4 md:mb-0 text-center md:text-left">
          &copy; {new Date().getFullYear()} JobTrackr. All rights reserved.
        </p>
        <div className="flex space-x-6">
          {/* GitHub Profile */}
          <a href="https://github.com/FrontEndExplorer-Temp" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
            <svg className="w-6 h-6 text-[#64748B] hover:text-[#3B82F6] transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.012c0 4.418 2.867 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.529 2.341 1.088 2.91.832.091-.646.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.579.688.481C19.135 20.175 22 16.427 22 12.012 22 6.484 17.523 2 12 2z" />
            </svg>
          </a>
          {/* GitHub Repository */}
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository">
            <svg className="w-6 h-6 text-[#64748B] hover:text-[#3B82F6] transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.012c0 4.418 2.867 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.529 2.341 1.088 2.91.832.091-.646.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.579.688.481C19.135 20.175 22 16.427 22 12.012 22 6.484 17.523 2 12 2z" />
            </svg>
          </a>
          {/* Portfolio */}
          <a href="https://purushoth-dev.netlify.app/" target="_blank" rel="noopener noreferrer" aria-label="Portfolio">
            <svg className="w-6 h-6 text-[#64748B] hover:text-[#3B82F6] transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a7 7 0 00-7 7v2a7 7 0 007 7 7 7 0 007-7V9a7 7 0 00-7-7zm0 2a5 5 0 015 5v2a5 5 0 01-10 0V9a5 5 0 015-5zm0 10a3 3 0 003-3V9a3 3 0 10-6 0v2a3 3 0 003 3z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
