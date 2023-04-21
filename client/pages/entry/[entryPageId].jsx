import React from 'react';
// import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import AppWrapper from '@/components/layout/AppWrapper';
import AppBody from '@/components/layout/AppBody';
// import sampleImage from '@/assets/images/sample.jpg';
// import FloatingButton from '@/components/FloatingButton';
import Preloader from '@/components/Preloader';
// import EditEntryOverlay from '@/components/EditEntryOverlay';

function EntryPage() {
  const router = useRouter();
  const { entryPageId } = router.query;
  console.log(entryPageId);

  const fetcher = (url) =>
    fetch(url, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
        Email: `${sessionStorage.getItem('userEmail')}`,
      },
    }).then((res) => res.json());

  const { data, isLoading, error } = useSWR(
    `https://journie-journalling-note-taking-app.onrender.com/api/get-entry/${entryPageId}`,
    fetcher
  );

  console.log(data);

  // const entryBody = (e) => {
  //   if (data) {
  //     return data.entry.entryBody.split('*');
  //   }
  // };

  // console.log(data.entryTitle);

  // console.log(entriesData);

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

  return (
    <AppWrapper>
      <AppBody>
        {data && (
          <div className=' md:px-20'>
            {/* <h2 className='text-2xl sm:text-3xl poppins'>entry Description</h2> */}
            <section className='entry-top flex flex-row gap-8 md:gap-16 items-center py-4 md:py-8 border-b'>
              <div className='icon'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-10 h-10'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10'
                  />
                </svg>
              </div>
              <div className='entry-details'>
                <div className='role font-bold poppins text-xl md:text-2xl'>
                  {data.entry.entryTitle}
                </div>
                <div className='text-gray-400 flex flex-row mt-3'>
                  {data.entry.updatedAt.slice(0, 10)} |{' '}
                  {data.entry.entryLocation}
                </div>
              </div>
            </section>
            <section className='entry-body flex flex-col gap-y-6 md:gap-y-10 py-8 text-[14px] leading-6'>
              {data.entry.entryBody.split('*').map((item, index) => {
                return (
                  <div key={index} className='flex flex-col gap-y-2'>
                    {item}
                  </div>
                );
              })}
            </section>
            <section className='p-3 mt-3'>
              <div className='flex flex-row-reverse gap-4'>
                <button className='bg-green-500 rounded text-white px-3 py-2 text-[12px] hidden'>
                  delete entry
                </button>
                <Link
                  href={`/edit-entry/${data.entry._id}`}
                  className='bg-green-500 rounded text-white px-3 py-2 text-[12px]'
                >
                  edit entry
                </Link>
              </div>
            </section>
          </div>
        )}

        {/* <FloatingButton /> */}
      </AppBody>
    </AppWrapper>
  );
}

export default EntryPage;

// export async function getServerSideProps(context) {
//   const { params } = context;

//   // fetch entries

//   // const { params } = context;
//   const eDResponse = await fetch(
//     'https://journie-journalling-note-taking-app.onrender.com/api/get-all-entries/',
//     {
//       headers: {
//         Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
//         Email: `${sessionStorage.getItem('userEmail')}`,
//       },
//     }
//   );
//   const entriesData = await eDResponse.json();

//   // console.log(entriesData);

//   return {
//     props: {
//       entriesData,
//       params,
//     },
//   };
// }
