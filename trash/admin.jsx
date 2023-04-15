import React from 'react';
import AppWrapper from '@/components/layout/AppWrapper';
import AppBody from '@/components/layout/AppBody';
import AdminJournalCard from '@/components/AdminJournalCard';

function Admin() {
  return (
    <AppWrapper>
      <AppBody>
        <div>
          <h2 className='text-2xl sm:text-3xl poppins'>All Jobs</h2>
        </div>
        <div className='mt-3'>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolorem fuga
          non facere? Culpa dolorem porro qui reiciendis officia autem ipsam
          libero maxime pariatur commodi? Possimus ad blanditiis rem quam velit,
          molestiae beatae rerum distinctio quod error natus autem iusto nisi
        </div>
        <section className='jobs my-3 py-3 flex flex-wrap md:gap-x-[2%] xl:gap-x-[5%]'>
          <AdminJournalCard />
        </section>
      </AppBody>
    </AppWrapper>
  );
}

export default Admin;
