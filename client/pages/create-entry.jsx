import React, { useState } from 'react';
// import Link from 'next/link';
import { useRouter } from 'next/router';
import AppWrapper from '../components/layout/AppWrapper';
import AppBody from '@/components/layout/AppBody';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function CreateEntryPage() {
  const router = useRouter();

  const [createEntryForm, setCreateEntryForm] = useState({
    entryTitle: '',
    entryLocation: '',
    entryBody: '',
  });

  async function createEntry(e) {
    e.preventDefault();

    if (
      createEntryForm.entryTitle === '' ||
      createEntryForm.entryLocation === '' ||
      createEntryForm.entryBody === ''
    ) {
      toast.error('please fill in all fields', { duration: 3000 });
      return;
    }

    const toastId = toast.loading('creating entry...');
    // console.log(createEntryForm);

    const entry = await axios.post(
      'https://journie-journalling-note-taking-app.onrender.com/api/create-entry',
      createEntryForm,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
          Email: `${sessionStorage.getItem('userEmail')}`,
        },
      }
    );

    console.log(entry);

    if (entry && entry.data.requestStatus === 'entry created successfully') {
      toast.success('entry created successfully', {
        id: toastId,
        duration: 4000,
      });
      setCreateEntryForm({
        entryTitle: '',
        entryLocation: '',
        entryBody: '',
      });
    }

    setTimeout(() => {
      router.push('/profile');
    }, 2000);
  }

  return (
    <AppWrapper>
      <AppBody>
        <main className='create-entry-page sm:px-3 pt-10 pb-20 rounded sm:border mt-20 sm:mt-40 md:w-[600px] md:mx-auto'>
          <div className='flex flex-col sm:px-3 gap-10'>
            {/* <Link href='/'> */}
            <div className='logo-wrapper text-center'>
              <span className='poppins font-bold text-purple-800 text-xl sm:text-3xl'>
                Create an entry
              </span>
              <p className='mt-2 text-[14px] w-full sm:w-[80%] mx-auto leading-7'>
                “Until we can manage time, we can manage nothing else.”
                <br />
                <span className='font-bold'>~ Peter Drucker</span>
              </p>
            </div>
            {/* </Link> */}
            <form>
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
                <label htmlFor='entry-body'>Entry body</label>
                <p className='text-purple-800 text-[10px] mt-2 underline'>
                  Create amazing journals with the help of Journie&rsquo;s
                  special syntax. Simply split your memories, todos/tasks, or
                  notes into well structured entries by adding a single asterick
                  between each paragraph.
                </p>
                <textarea
                  className='mt-2 px-3 py-2 border outline-none rounded'
                  type='text'
                  cols={20}
                  rows={30}
                  required
                  placeholder='enter your thought here'
                  value={createEntryForm.entryBody}
                  onChange={(e) => {
                    setCreateEntryForm({
                      ...createEntryForm,
                      entryBody: e.target.value,
                    });
                  }}
                  id='entry-body'
                ></textarea>
              </div>
              <button
                type='button'
                onClick={createEntry}
                className='submit text-center bg-green-500 py-3 text-[12px] sm:text-[14px] text-white rounded w-full'
              >
                Create Entry
              </button>
            </form>
          </div>
        </main>
      </AppBody>
    </AppWrapper>
  );
}

export default CreateEntryPage;
