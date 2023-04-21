import React from 'react';

function Preloader() {
  return (
    <div className='animate-pulse mt-[300px] text-center px-8 py-6 border w-[280px] sm:w-[500px] mx-auto'>
      <div className='nav-left logo-wrapper poppins font-bold text-purple-800 text-xl sm:text-3xl '>
        Journie
      </div>
      <div className='flex text-[12px] gap-4 text-center mt-4 justify-center'>
        <div>memories</div> | <div>todos</div> |<div>notes</div>
      </div>
    </div>
  );
}

export default Preloader;
