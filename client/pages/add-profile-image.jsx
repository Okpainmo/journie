import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

function SignUpPage() {
  const router = useRouter();

  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [isFilePicked, setIsFilePicked] = useState(false);

  async function handleFileUpload(e) {
    e.preventDefault();

    // check if profile picture is selected

    if (!isFilePicked || selectedImageFile === null) {
      toast.error('you have not added a profile picture, please select one', {
        duration: 3000,
      });
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', selectedImageFile);

    console.log(formData);
    console.log(selectedImageFile);

    const toastId = toast.loading('uploading file...');

    try {
      const updatedUserData = await axios.post(
        'http://localhost:5000/api/profile-image-upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
            Email: `${sessionStorage.getItem('userEmail')}`,
          },
        }
      );

      console.log(updatedUserData);

      if (
        updatedUserData &&
        updatedUserData.data.requestStatus ===
          'profile image uploaded successfully'
      ) {
        toast.success('profile image uploaded successfully', {
          id: toastId,
          duration: 4000,
        });
      }

      sessionStorage.setItem(
        'userProfileImageUrl',
        `${updatedUserData.data.updatedUser.profileImageUrl}`
      );

      setSelectedImageFile(null);
      setIsFilePicked(false);
      // setShowFileUpload(false);

      setTimeout(() => {
        router.push('/profile');
      }, 2000);
    } catch (error) {
      toast.error('error uploading file', { id: toastId, duration: 3000 });
      console.log(error);
    }
  }

  return (
    <>
      <Toaster />
      <main className='login-page mx-3 px-3 pt-12 pb-16 my-20 sm:my-32 rounded border sm:w-[400px] sm:mx-auto'>
        <div className='flex sm:px-3 flex-col gap-8'>
          {/* <Link href='/'> */}
          <div className='logo-wrapper poppins font-bold text-purple-800 text-xl sm:text-3xl text-center'>
            Journie/sign up
          </div>
          <p className='mt-2 text-[14px] w-full mx-auto leading-7 text-center'>
            “Memory is the diary we all carry about with us.”
            <br />
            <span className='font-bold'>~ Oscar Wilde</span>
          </p>
          <form>
            <div className='input-group flex flex-col mb-6 text-[12px] sm:text-[14px] gap-4'>
              <label htmlFor='profileImage'>Add a profile image</label>
              <input
                type='file'
                id='profileImage'
                onChange={(e) => {
                  setSelectedImageFile(e.target.files[0]);
                  setIsFilePicked(true);
                }}
              />
            </div>
            <button
              type='button'
              onClick={handleFileUpload}
              className='submit text-center bg-green-500 py-3 text-[12px] sm:text-[14px] text-white rounded w-full'
            >
              Submit
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

export default SignUpPage;
