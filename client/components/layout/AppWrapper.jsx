import React from 'react';
// import dynamic from 'next/dynamic';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';
// import FloatingButton from '../FloatingButton';
// import StickyNavbar from './StickyNavbar';

// const DynamicThemeSwitcher = dynamic(() => import('../ThemeSwitcher'), {
//   ssr: false,
// });

function MainAppLayout({ children }) {
  return (
    <>
      <Toaster />
      <main className='nunito-sans text-[12px] sm:text-[14px] px-3 sm:px-20 md:px-5 lg:w-[80%] xl:w-[80%] lg:mx-auto lg:px-0'>
        <Navbar />
        {children}
        <Footer />
        {/* <FloatingButton /> */}
        {/* <StickyNavbar /> */}
      </main>
    </>
  );
}

export default MainAppLayout;
