import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useSWR from 'swr';
import AppWrapper from '../../components/layout/AppWrapper';
import AppBody from '@/components/layout/AppBody';
import axios from 'axios';
import { toast } from 'react-hot-toast';
// import FloatingButton from '@/components/FloatingButton';
import Preloader from '@/components/Preloader';
// import Link from 'next/link';
// import AppWrapper from '../components/layout/AppWrapper';
// import AppBody from '@/components/layout/AppBody';

function EditEntryPage() {
  const router = useRouter();

  const { editEntryPageId } = router.query;
  console.log(editEntryPageId);

  const fetcher = (url) =>
    fetch(url, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
        Email: `${sessionStorage.getItem('userEmail')}`,
      },
    }).then((res) => res.json());

  const { data, isLoading, error } = useSWR(
    `https://journie-journalling-note-taking-app.onrender.com/api/get-entry/${editEntryPageId}`,
    fetcher
  );

  const title = (e) => {
    if (data) {
      return data.entry.entryTitle;
    }
    // else {
    //   return '';
    // }
  };

  const location = (e) => {
    if (data) {
      return data.entry.entryLocation;
    }
    // else {
    //   mutate(
    //     `https://journie-journalling-note-taking-app.onrender.com/api/get-entry/${editEntryPageId}`
    //   );
    // }
  };

  const entryBody = (e) => {
    if (data) {
      return data.entry.entryBody;
    }
    // else {
    //   return '';
    // }
  };

  const [editEntryForm, setEditEntryForm] = useState({
    entryTitle: title(),
    entryLocation: location(),
    entryBody: entryBody(),
  });

  async function editEntry(e) {
    e.preventDefault();

    if (
      editEntryForm.entryTitle === '' ||
      editEntryForm.entryLocation === '' ||
      editEntryForm.entryBody === ''
    ) {
      toast.error('please fill in all fields', { duration: 3000 });
      return;
    }

    const toastId = toast.loading('submitting edit...');

    const editedEntry = await axios.patch(
      `https://journie-journalling-note-taking-app.onrender.com/api/edit-entry/${data.entry._id}`,
      editEntryForm,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
          Email: `${sessionStorage.getItem('userEmail')}`,
        },
      }
    );

    console.log(editedEntry);

    if (
      editedEntry &&
      editedEntry.data.requestStatus === 'entry updated successfully'
    ) {
      toast.success('entry updated successfully', {
        id: toastId,
        duration: 4000,
      });
    }

    setTimeout(() => {
      router.push('/profile');
    }, 2000);
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
          className='submit text-center bg-green-500 py-3 text-[12px] sm:text-[14px] text-white rounded w-[150px]'
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
    <>
      <Head>
        <title>Journie - edit entry</title>
      </Head>
      <AppWrapper>
        <AppBody>
          <main className='bg-white login-page sm:px-3 pt-10 pb-20 rounded sm:border mt-20 sm:mt-40 md:w-[600px] md:mx-auto'>
            <div className='flex flex-col sm:px-3 gap-8'>
              {/* <Link href='/'> */}
              <div className='logo-wrapper text-center'>
                <span className='poppins font-bold text-purple-800 text-xl sm:text-3xl'>
                  Edit an entry
                </span>
                <p className='mt-2 text-[14px] w-full sm:w-[80%] mx-auto leading-7'>
                  “The key is not to prioritize what’s on your schedule, but to
                  schedule your priorities.”
                  <br />
                  <span className='font-bold'>~ Stephen Covey</span>
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
                    value={editEntryForm.entryTitle}
                    onChange={(e) => {
                      setEditEntryForm({
                        ...editEntryForm,
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
                    value={editEntryForm.entryLocation}
                    onChange={(e) => {
                      setEditEntryForm({
                        ...editEntryForm,
                        entryLocation: e.target.value,
                      });
                    }}
                    id='entry-location'
                  />
                </div>
                <div className='input-group flex flex-col mb-6 text-[12px] sm:text-[14px]'>
                  <label htmlFor='entry-body'>Entry body</label>
                  <p className='text-purple-800 text-[10px] mt-2 underline'>
                    Create amazing entries with the help of Journie&rsquo;s
                    special syntax. Simply split your memories, todos/tasks, or
                    notes into well structured entries by adding a single
                    asterick between each paragraph.
                  </p>
                  <textarea
                    className='mt-2 px-3 py-2 border outline-none rounded'
                    type='text'
                    cols={20}
                    rows={30}
                    required
                    placeholder='enter your thought here'
                    value={editEntryForm.entryBody}
                    onChange={(e) => {
                      setEditEntryForm({
                        ...editEntryForm,
                        entryBody: e.target.value,
                      });
                    }}
                    id='entry-body'
                  ></textarea>
                </div>
                <button
                  type='button'
                  onClick={editEntry}
                  className='submit text-center bg-green-500 py-3 text-[12px] sm:text-[14px] text-white rounded w-full'
                >
                  Edit Entry
                </button>
              </form>
            </div>
          </main>
          {/* <FloatingButton /> */}
        </AppBody>
      </AppWrapper>
    </>
  );
}

export default EditEntryPage;

// export async function getServerSideProps(context) {
//   // fetch single entry

//   const { params } = context;
//   const eDResponse = await fetch(
//     `https://journie-journalling-note-taking-app.onrender.com/api/get-entry/${params.editEntryPageId}`
//   );
//   const entryData = await eDResponse.json();

//   return {
//     props: {
//       entryData,
//     },
//   };
// }
