import React, { useState } from 'react';
import AppWrapper from '../../components/layout/AppWrapper';
import AppBody from '@/components/layout/AppBody';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import FloatingButton from '@/components/FloatingButton';
// import Link from 'next/link';
// import AppWrapper from '../components/layout/AppWrapper';
// import AppBody from '@/components/layout/AppBody';

function EditEntryPage({ entryData }) {
  const {
    entryTitle: title,
    entryLocation: location,
    entryBody: body,
  } = entryData.entry;

  const [editEntryForm, setEditEntryForm] = useState({
    entryTitle: title,
    entryLocation: location,
    entryBody: body,
  });

  console.log(title);

  async function editEntry(e) {
    console.log(entryData);
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
      `https://journie-journalling-note-taking-app.onrender.com/api/edit-entry/${entryData.entry._id}`,
      editEntryForm
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
  }

  return (
    <AppWrapper>
      <AppBody>
        <main className='bg-white login-page px-3 pt-10 pb-20 rounded border mt-20 sm:mt-40 sm:w-[600px] sm:mx-auto'>
          <div className='flex flex-col sm:px-3 gap-8'>
            {/* <Link href='/'> */}
            <div className='logo-wrapper text-center'>
              <span className='poppins font-bold text-purple-800 text-xl sm:text-3xl'>
                Edit an entry
              </span>
              <p className='mt-2 text-[14px] w-[80%] mx-auto leading-7'>
                “Memory is the treasure house of the mind wherein the monuments
                thereof are kept and preserved.”
                <br />
                <span className='font-bold'>~ Thomas Fuller</span>
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
                <label htmlFor='entry-location'>Entry body</label>
                <textarea
                  className='mt-2 px-3 py-2 border outline-none rounded'
                  type='text'
                  cols={20}
                  rows={5}
                  required
                  placeholder='enter your thought here'
                  value={editEntryForm.entryBody}
                  onChange={(e) => {
                    setEditEntryForm({
                      ...editEntryForm,
                      entryBody: e.target.value,
                    });
                  }}
                  id='entry-location'
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
        <FloatingButton />
      </AppBody>
    </AppWrapper>
  );
}

export default EditEntryPage;

export async function getServerSideProps(context) {
  // fetch single entry

  const { params } = context;
  const eDResponse = await fetch(
    `https://journie-journalling-note-taking-app.onrender.com/api/get-entry/${params.editEntryPageId}`
  );
  const entryData = await eDResponse.json();

  return {
    props: {
      entryData,
    },
  };
}
