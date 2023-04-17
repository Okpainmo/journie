import React from 'react';
import Link from 'next/link';

function Navbar() {
  return (
    <nav className='flex justify-between items-center px-3 py-2 fixed top-0 left-0 right-0 shadow bg-white sm:px-20 md:px-5 lg:px-[10%] xl:px-[15%]'>
      <Link href='/'>
        <div className='nav-left logo-wrapper poppins font-bold text-purple-800 text-xl sm:text-3xl'>
          Journie
        </div>
      </Link>
      <div className='nav-right gap-4 items-center hidden'>
        <Link href='/log-in'>
          <button className='border border-green-500 text-green-500 rounded px-3 py-2 text-[12px]'>
            log in
          </button>
        </Link>
        <Link href='/sign-out'>
          <button className='bg-green-500 rounded text-white px-3 py-2 text-[12px]'>
            sign out
          </button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;