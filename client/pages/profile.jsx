import React, { useState } from 'react';
import Image from 'next/image';
// import { useRouter } from 'next/router';
import Link from 'next/link';
import AppWrapper from '@/components/layout/AppWrapper';
import AppBody from '@/components/layout/AppBody';
import EntryCard from '@/components/EntryCard';
import FloatingButton from '@/components/FloatingButton';
import useSWR, { mutate } from 'swr';
import MyModal from '@/components/MyModal';
import Preloader from '@/components/Preloader';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import banner from '@/assets/images/journie-banner.jpg';
import Emoji from '@/components/Emoji';

function ProfilePage() {
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
      <main className='flex flex-col item-center'>
        <div className='mt-[300px] mb-4 text-center text-purple-800 text-[16px]'>
          failed to load: an error was encountered!!!
        </div>
        <Link
          type='button'
          href='/'
          className='submit text-center bg-green-500 py-3 text-[12px] sm:text-[14px] text-white rounded w-[150px] mx-auto'
        >
          return to login
        </Link>
      </main>
    );
  }

  if (isLoading) {
    return <Preloader />;
  }

  const userFirstName = sessionStorage.getItem('userName').split(' ')[0];
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
          <h2 className='text-2xl sm:text-3xl sm:mb-8 poppins mb-4 font-bold'>
            Hi {userFirstName}{' '}
            <div className='text-4xl inline-block'>
              <Emoji label='wave' symbol='👋' />
            </div>
          </h2>

          <Image
            src={banner}
            alt='journie banner'
            className='w-full lg:h-[300px] bg-contain'
            placeholder='blur'
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
        <section className='jobs py-3 flex flex-wrap md:gap-x-[2%] xl:gap-x-[5%]'>
          {data.entries.length < 1 ? (
            <div className='mt-10 text-center text-purple-800 text-[14px] w-[75%] sm:w-[500px] mx-auto'>
              Opps!!! your journal is empty... your entries will show up here
              when you create them.
            </div>
          ) : (
            data.entries.map((entry) => (
              <EntryCard
                key={entry._id}
                entry={entry}
                openModal={openModal}
                updateEntryId={updateEntryId}
              />
            ))
          )}
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
