import React, { useState } from 'react';
// import Link from 'next/link';
// import AppWrapper from '../components/layout/AppWrapper';
// import AppBody from '@/components/layout/AppBody';

function SignUpPage() {
  const [createEntryForm, setCreateEntryForm] = useState({
    entryTitle: '',
    entryLocation: '',
    entryBody: '',
  });

  return (
    <div
      className='overlay fixed top-0 left-0 h-screen w-full'
      style={{ backgroundColor: 'rgba(255, 255, 255, 0)' }}
    >
      <main className='bg-white login-page mx-3 px-3 pt-6 pb-10 rounded border mt-40 sm:w-[600px] sm:mx-auto'>
        <div className='flex flex-col px-3 gap-8'>
          {/* <Link href='/'> */}
          <div className='logo-wrapper poppins font-bold text-purple-800 text-xl sm:text-3xl text-center'>
            Create Entry
          </div>
          {/* </Link> */}
          <form clasName='flex'>
            <div className='input-group flex flex-col mb-6 text-[12px] sm:text-[14px]'>
              <label htmlFor='entry-title'>Entry title</label>
              <input
                className='mt-2 px-3 py-2 border outline-none rounded'
                type='text'
                required
                placeholder='entry title'
                value={createEntryForm.entryTitle}
                onChange={(e) => {
                  setCreateEntryForm({
                    ...createEntryForm,
                    entryTitle: e.target.value,
                  });
                }}
                id='entry-title'
              />
            </div>
            <div className='input-group flex flex-col mb-6 text-[12px] sm:text-[14px]'>
              <label htmlFor='entry-location'>Entry location</label>
              <input
                className='mt-2 px-3 py-2 border outline-none rounded'
                type='text'
                required
                placeholder='entry location'
                value={createEntryForm.entryLocation}
                onChange={(e) => {
                  setCreateEntryForm({
                    ...createEntryForm,
                    entryLocation: e.target.value,
                  });
                }}
                id='entry-location'
              />
            </div>
            <div className='input-group flex flex-col mb-6 text-[12px] sm:text-[14px]'>
              <label htmlFor='entry-location'>Entry body</label>
              <textarea
                className='mt-2 px-3 py-2 border outline-none rounded'
                type='text'
                cols={20}
                rows={5}
                required
                placeholder='enter your thought here'
                value={createEntryForm.entryBody}
                onChange={(e) => {
                  setCreateEntryForm({
                    ...createEntryForm,
                    entryBody: e.target.value,
                  });
                }}
                id='entry-location'
              ></textarea>
            </div>
            <button
              type='button'
              className='submit text-center bg-green-500 py-3 text-[12px] text-white rounded w-full'
            >
              Create Entry
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default SignUpPage;
