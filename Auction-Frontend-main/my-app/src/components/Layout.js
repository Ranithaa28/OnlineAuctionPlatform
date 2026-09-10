import React from 'react';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-site-background">
      <main className="flex-grow min-h-screen-without-footer">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
