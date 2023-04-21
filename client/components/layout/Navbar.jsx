import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// import NavPopOver from '../NavPopOver';

const StaticPopOver = dynamic(() => import('../NavPopOver'), {
  ssr: false,
});

function Navbar() {
  return (
    <nav className='flex justify-between items-center px-3 py-2 sm:py-4 fixed top-0 left-0 right-0 shadow bg-white sm:px-20 md:px-5 lg:px-[10%] xl:px-[10%]'>
      <Link href='/profile'>
        <div className='nav-left logo-wrapper poppins font-bold text-purple-800 text-xl sm:text-3xl'>
          Journie
        </div>
      </Link>
      <div className='nav-right gap-4 items-center'>
        <Link href='/log-in' className='hidden'>
          <button className='border border-green-500 text-green-500 rounded px-3 py-2 text-[12px]'>
            log in
          </button>
        </Link>
        <Link href='/sign-out' className='hidden'>
          <button className='bg-green-500 rounded text-white px-3 py-2 text-[12px]'>
            sign out
          </button>
        </Link>
        <StaticPopOver />
      </div>
    </nav>
  );
}

export default Navbar;
