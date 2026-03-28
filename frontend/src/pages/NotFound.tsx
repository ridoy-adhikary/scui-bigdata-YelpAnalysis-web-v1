import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-9xl font-display font-bold text-primary-100">404</h1>
      <h2 className="text-3xl font-display font-bold text-gray-950 mt-[-3rem] mb-6">Page Not Found</h2>
      <p className="text-gray-600 text-lg max-w-md mb-12">
        The page you are looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <Link 
        to="/" 
        className="flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-700 transition-all hover:-translate-y-1 shadow-lg"
      >
        <HomeIcon size={20} /> Back to Homepage
      </Link>
    </div>
  );
};

export default NotFound;