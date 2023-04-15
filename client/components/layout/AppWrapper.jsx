import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
// import FloatingButton from '../FloatingButton';
// import StickyNavbar from './StickyNavbar';

function MainAppLayout({ children }) {
  return (
    <main className='nunito-sans text-[12px] sm:text-[14px] px-3 sm:px-20 md:px-5 lg:w-[80%] xl:w-[70%] lg:mx-auto lg:px-0'>
      <Navbar />
      {children}
      <Footer />
      {/* <FloatingButton /> */}
      {/* <StickyNavbar /> */}
    </main>
  );
}

export default MainAppLayout;
