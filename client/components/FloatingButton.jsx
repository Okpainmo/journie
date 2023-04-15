import React from 'react';
import Link from 'next/link';

function FloatingButton() {
  return (
    <Link href='create-entry'>
      <button className='fixed bottom-[30px] lg:bottom-20 right-[30px] lg:right-20 rounded-[100%] bg-purple-800 text-white p-4'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-6 h-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 4.5v15m7.5-7.5h-15'
          />
        </svg>
      </button>
    </Link>
  );
}

export default FloatingButton;
