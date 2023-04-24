import React from 'react';

function Footer() {
  return (
    <footer className='mt-20 mb-12'>
      <div className='logo-wrapper poppins font-bold text-purple-800 text-2xl my-4'>
        Journie
      </div>
      <div>
        Helping you to be more productive and happy, one day at a time -{' '}
        <span className='font-bold'>
          Notes, todos/schedules, and journalling
        </span>{' '}
        all in one place.
      </div>
      <div className='my-3'>&copy; 2023 Journie. All rights reserved.</div>
    </footer>
  );
}

export default Footer;
