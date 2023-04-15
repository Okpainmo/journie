import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import sampleImage from '@/assets/images/sample.jpg';

function AdminJournalCard() {
  return (
    <Link
      href='/entry-page'
      className='w-[100%] journal-card rounded shadow my-4 sm:my-6 md:w-[48%] xl:w-[30%]'
    >
      <section className='flex gap-8 sm:gap-16 md:gap-8 items-center px-3 py-2'>
        <div className='company-logo'>
          <Image
            src={sampleImage}
            alt='company-logo'
            className='w-[60px] h-[60px] rounded-[100%]'
          />
        </div>
        <div className='journal-details'>
          <div className='role font-bold poppins'>Front-end Engineer</div>
          <div className='text-gray-400 flex flex-row'>
            <span className='company-details text-[10px]'>
              Facebook | Los Angeles, USA
            </span>
          </div>
          <div className='py-1 flex flex- gap-3'>
            <div className='rounded bg-gray-300 text-[10px] p-1'>full-time</div>
            <div className='rounded bg-gray-300 text-[10px] p-1'>Hybrid</div>
            <div className='rounded bg-gray-300 text-[10px] p-1'>$100,000</div>
          </div>
        </div>
      </section>
      <section className='p-3 mt-3'>
        <div className='flex flex-row-reverse gap-4'>
          <button className='bg-green-500 rounded text-white px-3 py-2 text-[10px]'>
            remove journal
          </button>
          <button className='bg-green-500 rounded text-white px-3 py-2 text-[10px]'>
            edit journal
          </button>
        </div>
      </section>
    </Link>
  );
}

export default AdminJournalCard;
