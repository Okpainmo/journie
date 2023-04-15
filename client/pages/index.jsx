import React from 'react';
import AppWrapper from '@/components/layout/AppWrapper';
import AppBody from '@/components/layout/AppBody';
import JournalCard from '@/components/JournalCard';
import FloatingButton from '@/components/FloatingButton';

function Home({ entriesData }) {
  // console.log(entriesData);
  return (
    <AppWrapper>
      <AppBody>
        <section className='page-intro lg:w-[80%]'>
          <h2 className='text-2xl poppins mb-4 font-bold'>My Entries</h2>
          <div className='intro-text'>
            <div className='py-2'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam,
              quam recusandae consequatur nulla quis in repudiandae quo quidem
              nihil aspernatur, alias, vitae similique? Neque iure officia sint
              necessitatibus ipsam accusamus veniam praesentium ex qui facere
              nisi, ipsum nostrum pariatur.
            </div>
            <div className='py-2'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam,
              quam recusandae consequatur nulla quis in repudiandae quo quidem
              nihil aspernatur, alias, vitae similique? Neque iure officia sint.
            </div>
          </div>
        </section>
        <section className='jobs my-3 py-3 flex flex-wrap md:gap-x-[2%] xl:gap-x-[5%]'>
          {entriesData.entries.map((entry) => (
            <JournalCard key={entry._id} entry={entry} />
          ))}
          {/* <JournalCard />
          <JournalCard />
          <JournalCard />
          <JournalCard />
          <JournalCard />
          <JournalCard />
          <JournalCard />
          <JournalCard />
          <JournalCard />
          <JournalCard /> */}
        </section>
        <FloatingButton />
      </AppBody>
    </AppWrapper>
  );
}

export default Home;

export async function getServerSideProps() {
  // fetch entries

  // const { params } = context;
  const eDResponse = await fetch(
    'https://journie-journalling-note-taking-app.onrender.com/api/get-all-entries/'
  );
  const entriesData = await eDResponse.json();

  // console.log(entriesData);

  return {
    props: {
      entriesData,
    },
  };
}
