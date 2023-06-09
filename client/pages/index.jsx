import React, { useState } from 'react';
import Head from 'next/head';
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
    if (loginForm.email === '' || loginForm.password === '') {
      return toast.error('please fill in all fields', { duration: 3000 });
    }

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

        localStorage.setItem('userToken', `${loggedInUser.data.token}`);
        localStorage.setItem('userEmail', `${loggedInUser.data.user.email}`);

        const userToken = localStorage.getItem('userToken');
        const userEmail = localStorage.getItem('userEmail');

        console.log(userToken, userEmail);

        console.log(loggedInUser);

        const userName = loggedInUser.data.user.fullName;
        // console.log(userName);
        localStorage.setItem('userName', `${userName}`);

        localStorage.setItem(
          'userProfileImageUrl',
          `${loggedInUser.data.user.profileImageUrl}`
        );

        setTimeout(() => {
          router.push('/profile');
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        'login failed... please try again with correct credentials or check you network',
        {
          id: toastId,
          duration: 4000,
        }
      );
    }
  };

  return (
    <>
      <Head>
        <title>Journie - log in</title>
      </Head>
      <Toaster />
      <main className='login-page pt-12 pb-16 my-20 sm:my-32 mx-3 px-3 rounded border sm:w-[400px] sm:mx-auto'>
        <div className='flex flex-col sm:px-3 gap-8'>
          {/* <Link href='/'> */}
          <div className='logo-wrapper poppins font-bold text-purple-800 text-xl sm:text-3xl text-center'>
            Journie/login
          </div>
          <p className='mt-2 text-[14px] w-full mx-auto leading-7 text-center'>
            “Productivity is being able to do things that you were never able to
            do before.”
            <br />
            <span className='font-bold'>~ Franz Kafka</span>
          </p>
          {/* </Link> */}
          <form>
            <div className='input-group flex flex-col mb-6 text-[12px] sm:text-[14px]'>
              <label htmlFor='email'>Email</label>
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
              <Link href='/sign-up' className='underline text-purple-800'>
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
