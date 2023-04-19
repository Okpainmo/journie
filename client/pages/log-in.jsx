import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

function LoginPage() {
  const router = useRouter();

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const logInUser = async (e) => {
    e.preventDefault();

    console.log(loginForm);

    const toastId = toast.loading('logging in...');

    try {
      const loggedInUser = await axios.post(
        'https://journie-journalling-note-taking-app.onrender.com/api/log-in',
        loginForm
      );

      if (
        loggedInUser &&
        loggedInUser.data.requestStatus === 'login successful'
      ) {
        toast.success('login successful', {
          id: toastId,
          duration: 4000,
        });
        localStorage.setItem(
          'journieUser',
          JSON.stringify(loggedInUser.data.user._id)
        );

        setTimeout(() => {
          router.push('/profile');
        }, 2000);
      }

      console.log(loggedInUser);
    } catch (error) {
      console.log(error);
      toast.error('login failed... please try again with correct credentials', {
        id: toastId,
        duration: 4000,
      });
    }
  };

  return (
    <>
      <Toaster />
      <main className='login-page mx-3 px-3 pt-6 pb-10 mt-20 sm:mt-40 rounded border sm:w-[400px] sm:mx-auto'>
        <div className='flex flex-col sm:px-3 gap-8'>
          {/* <Link href='/'> */}
          <div className='logo-wrapper poppins font-bold text-purple-800 text-xl sm:text-3xl text-center'>
            Journie/login
          </div>
          <p className='mt-2 text-[14px] w-full mx-auto leading-7 text-center'>
            “Humans, not places, make memories.”
            <br />
            <span className='font-bold'>~ Ama Ata Aidoo</span>
          </p>
          {/* </Link> */}
          <form>
            <div className='input-group flex flex-col mb-6 text-[12px] sm:text-[14px]'>
              <label htmlFor='email'>email</label>
              <input
                className='mt-2 px-3 py-2 border outline-none rounded'
                type='email'
                required
                placeholder='please input your username'
                value={loginForm.email}
                onChange={(e) => {
                  setLoginForm({
                    ...loginForm,
                    email: e.target.value,
                  });
                }}
                id='email'
              />
            </div>
            <div className='input-group flex flex-col mb-6 text-[12px] sm:text-[14px]'>
              <label htmlFor='username'>Password</label>
              <input
                className='mt-2 px-3 py-2 border outline-none rounded'
                type='password'
                required
                placeholder='please input your password'
                value={loginForm.password}
                onChange={(e) => {
                  setLoginForm({
                    ...loginForm,
                    password: e.target.value,
                  });
                }}
                id='password'
              />
            </div>
            <button
              type='button'
              onClick={logInUser}
              className='submit text-center bg-green-500 py-3 text-[12px] sm:text-[14px] text-white rounded w-full'
            >
              Submit
            </button>
            <p className='text-center text-[12px] sm:text-[14px] mt-4'>
              New to Journie?{' '}
              <Link href='/' className='underline text-purple-800'>
                sign-up instead
              </Link>{' '}
            </p>
          </form>
        </div>
      </main>
    </>
  );
}

export default LoginPage;
