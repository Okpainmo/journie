import React from 'react';
import Link from 'next/link';

// import Image from 'next/image';
// import sampleImage from '@/assets/images/sample.jpg';

function EntryCard({ entry, openModal, updateEntryId }) {
  // console.log(entry._id);
  const postId = entry._id;

  const postSlug = `${postId}`;

  return (
    <main
      className='w-[100%] journal-card rounded my-3 sm:my-6 md:w-[48%] xl:w-[30%] opacity-0'
      style={{
        transition: 'opacity .75s ease-in',
        opacity: '1',
        boxShadow: '0 0 10px -5px grey',
      }}
    >
      <section
        className='flex items-center px-4 py-2 min-h-[100px] justify-between'
        // style={{ alignSelf: 'flex-start' }}
      >
        <div className='icon  w-[10%]'>
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
        <Link className='entry-details w-[72%]' href={`/entry/${postSlug}`}>
          <div>
            <div className='role font-bold poppins capitalize'>
              {entry.entryTitle}
            </div>
            <div className='text-gray-400 flex flex-row mt-2'>
              <span className='company-details text-[12px]'>
                {entry.updatedAt.slice(0, 10)} | {entry.entryLocation}
              </span>
            </div>
          </div>
        </Link>
        <button
          className='delete w-[10%]'
          onClick={() => {
            openModal();
            updateEntryId(postId);
          }}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6 text-gray-600'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
            />
          </svg>
        </button>
      </section>
    </main>
  );
}

export default EntryCard;
