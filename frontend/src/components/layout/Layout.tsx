import React from 'react';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ChatWidget from '../chatbot/ChatWidget';

const Layout: React.FC = () => {
  const location = useLocation();
  const isResearchAiPage = location.pathname === '/research-ai';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="grow">
        <Outlet />
      </main>

      {!isResearchAiPage && <Footer />}
      <ChatWidget />
    </div>
  );
};

export default Layout;
