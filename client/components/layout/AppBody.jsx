import React from 'react';

function AppBody({ children }) {
  return (
    <main className='mt-20 md:mt-28 min-h-[800px] md:min-h-[1200px]'>
      {children}
    </main>
  );
}

export default AppBody;
