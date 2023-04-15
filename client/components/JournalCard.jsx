import React from 'react';
import Link from 'next/link';
// import Image from 'next/image';
// import sampleImage from '@/assets/images/sample.jpg';

function AdminJournalCard({ entry }) {
  const postSlug = `${entry._id}`;
  console.log(postSlug);

  return (
    <Link
      href={`/${postSlug}`}
      className='w-[100%] journal-card rounded shadow my-4 sm:my-6 md:w-[48%] xl:w-[30%]'
    >
      <section
        className='flex gap-8 sm:gap-16 md:gap-8 items-center px-3 py-2'
        // style={{ alignSelf: 'flex-start' }}
      >
        <div className='icon'>
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
              d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10'
            />
          </svg>
        </div>
        <div className='entry-details'>
          <div className='role font-bold poppins'>{entry.entryTitle}</div>
          <div className='text-gray-400 flex flex-row mt-2'>
            <span className='company-details text-[12px]'>
              {entry.updatedAt.slice(0, 10)} | {entry.entryLocation}
            </span>
          </div>
        </div>
      </section>
    </Link>
  );
}

export default AdminJournalCard;
