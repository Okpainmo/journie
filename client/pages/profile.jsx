import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import AppWrapper from '@/components/layout/AppWrapper';
import AppBody from '@/components/layout/AppBody';
import JournalCard from '@/components/JournalCard';
import FloatingButton from '@/components/FloatingButton';
import useSWR, { mutate } from 'swr';
import MyModal from '@/components/MyModal';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import banner from '@/assets/images/journie-banner.jpg';

function ProfilePage() {
  // const userToken = sessionStorage.getItem('userToken');
  // const userEmail = sessionStorage.getItem('userEmail');

  // if (!sessionStorage || !userToken || !userEmail) {
  //   router.push('/');
  // }

  const fetcher = (url) =>
    fetch(url, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
        Email: `${sessionStorage.getItem('userEmail')}`,
      },
    }).then((res) => res.json());

  const { data, isLoading, error } = useSWR(
    'https://journie-journalling-note-taking-app.onrender.com/api/get-all-entries/',
    fetcher
  );

  console.log(data);

  const [entryId, setEntryId] = useState('');

  const updateEntryId = (postId) => {
    setEntryId(postId);
    console.log(entryId);
  };

  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  async function deleteEntry(entryId) {
    const toastId = toast.loading('deleting entry...');

    // ...

    const deletedEntry = await axios.delete(
      `https://journie-journalling-note-taking-app.onrender.com/api/delete-entry/${entryId}`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
          Email: `${sessionStorage.getItem('userEmail')}`,
        },
      }
    );

    mutate(
      'https://journie-journalling-note-taking-app.onrender.com/api/get-all-entries/'
    );

    console.log(deletedEntry);

    if (
      deletedEntry &&
      deletedEntry.status &&
      deletedEntry.data.requestStatus === 'entry deleted successfully'
    ) {
      toast.success('entry deleted successfully', {
        id: toastId,
        duration: 4000,
      });
    } else {
      toast.error('Something went wrong - entry not deleted');
    }

    setEntryId('');
  }

  if (error) {
    return (
      <div className='mt-[300px] text-center text-purple-800 text-[16px]'>
        failed to load: an error was encountered!!!
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='animate-pulse mt-[300px] text-center text-purple-800 text-[16px]'>
        Loading...
      </div>
    );
  }

  // const loggedInUser = localStorage.getItem('journieUser');
  // console.log(loggedInUser.slice(1, loggedInUser.length - 1));

  // if (local)
  return (
    <AppWrapper>
      <AppBody>
        <MyModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          closeModal={closeModal}
          openModal={openModal}
          deleteEntry={deleteEntry}
          entryId={entryId}
        />
        <section className='page-intro'>
          <h2 className='text-2xl poppins mb-4 font-bold'>My Entries</h2>

          <Image
            src={banner}
            alt='journie banner'
            className='w-full lg:h-[300px] bg-contain'
          />
          <div className='intro-text lg:w-[80%]'>
            <div className='py-4 sm:text-[14px]'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam,
              quam recusandae consequatur nulla quis in repudiandae quo quidem
              nihil aspernatur, alias, vitae similique? Neque iure officia sint
              necessitatibus ipsam accusamus veniam praesentium ex qui facere
              nisi, ipsum nostrum pariatur.
            </div>
          </div>
        </section>
        <section className='jobs mb-3 py-3 flex flex-wrap md:gap-x-[2%] xl:gap-x-[5%]'>
          {data.entries.length < 1 ? (
            <div className='mt-10 text-center text-purple-800 text-[14px] w-[75%] sm:w-[500px] mx-auto'>
              Opps!!! your journal is empty... your entries will show up here
              when you create them.
            </div>
          ) : (
            data.entries.map((entry) => (
              <JournalCard
                key={entry._id}
                entry={entry}
                openModal={openModal}
                updateEntryId={updateEntryId}
              />
            ))
          )}
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
// }

export default ProfilePage;

// export async function getServerSideProps() {
//   // fetch entries

//   // const { params } = context;
//   const eDResponse = await fetch(
//     'https://journie-journalling-note-taking-app.onrender.com/api/get-all-entries/'
//   );
//   const entriesData = await eDResponse.json();

//   // console.log(entriesData);

//   return {
//     props: {
//       entriesData,
//     },
//   };
// }
