import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

function SignUpPage() {
  const router = useRouter();

  // handling file upload

  const [signUpForm, setSignUpForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  async function createUser(e) {
    e.preventDefault();

    if (
      signUpForm.fullName === '' ||
      signUpForm.email === '' ||
      signUpForm.password === '' ||
      signUpForm.confirmPassword === ''
    ) {
      toast.error('please fill in all fields', { duration: 3000 });
      return;
    }

    if (signUpForm.password !== signUpForm.confirmPassword) {
      toast.error('passwords do not match', { duration: 3000 });
      return;
    }

    if (
      signUpForm.password.length < 6 ||
      signUpForm.confirmPassword.length < 6
    ) {
      toast.error('passwords must be at least 6 characters', {
        duration: 3000,
      });
      return;
    }

    console.log(signUpForm);

    const toastId = toast.loading('creating account...');

    try {
      const newUser = await axios.post(
        // 'https://journie-journalling-note-taking-app.onrender.com/api/sign-up', // this is the endpoint for creating a new user
        'https://journie-journalling-note-taking-app.onrender.com/api/sign-up', // this is the endpoint for creating a new user
        signUpForm
      );

      console.log(newUser);

      if (
        newUser &&
        newUser.data.requestStatus === 'account created successfully'
      ) {
        toast.success('account created successfull', {
          id: toastId,
          duration: 4000,
        });
      }

      setSignUpForm({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });

      sessionStorage.setItem('userToken', `${newUser.data.token}`);
      sessionStorage.setItem('userEmail', `${newUser.data.user.email}`);

      const userToken = sessionStorage.getItem('userToken');
      const userEmail = sessionStorage.getItem('userEmail');

      console.log(userToken, userEmail);

      const userName = newUser.data.user.fullName;
      // console.log(userName);
      sessionStorage.setItem('userName', `${userName}`);

      setTimeout(() => {
        router.push('/add-profile-image');
      }, 2000);
    } catch (error) {
      toast.error('error creating user', { id: toastId, duration: 3000 });
      console.log(error);
    }
  }

  return (
    <>
      <Toaster />
      <Head>
        <title>Journie - sign up</title>
      </Head>
      <main className='login-page mx-3 px-3 pt-12 pb-16 my-20 sm:my-32 rounded border sm:w-[400px] sm:mx-auto'>
        <div className='flex sm:px-3 flex-col gap-8'>
          {/* <Link href='/'> */}
          <div className='logo-wrapper poppins font-bold text-purple-800 text-xl sm:text-3xl text-center'>
            Journie/sign up
          </div>
          <p className='mt-2 text-[14px] w-full mx-auto leading-7 text-center'>
            “The tragedy in life doesn’t lie in not reaching your goal. The
            tragedy lies in having no goal to reach.”
            <br />
            <span className='font-bold'>~ Benjamin E. Mays</span>
          </p>

          <form>
            <div className='full-name input-group flex flex-col mb-6 text-[12px] sm:text-[14px]'>
              <label htmlFor='full-name'>Full name</label>
              <input
                className='mt-2 px-3 py-2 border outline-none rounded'
                type='text'
                required
                placeholder='please input your full name'
                value={signUpForm.fullName}
                onChange={(e) => {
                  setSignUpForm({
                    ...signUpForm,
                    fullName: e.target.value,
                  });
                }}
                id='fullName'
              />
            </div>
            <div className='email input-group flex flex-col mb-6 text-[12px] sm:text-[14px]'>
              <label htmlFor='email'>Email</label>
              <input
                className='mt-2 px-3 py-2 border outline-none rounded'
                type='email'
                required
                placeholder='please add your email address'
                value={signUpForm.email}
                onChange={(e) => {
                  setSignUpForm({
                    ...signUpForm,
                    email: e.target.value,
                  });
                }}
                id='email'
              />
            </div>
            <div className='password input-group flex flex-col mb-6 text-[12px] sm:text-[14px]'>
              <label htmlFor='password'>Password</label>
              <input
                className='mt-2 px-3 py-2 border outline-none rounded'
                type='text'
                required
                placeholder='please input your password'
                value={signUpForm.password}
                onChange={(e) => {
                  setSignUpForm({
                    ...signUpForm,
                    password: e.target.value,
                  });
                }}
                id='password'
              />
            </div>
            <div className='confirm-password input-group flex flex-col mb-6 text-[12px] sm:text-[14px]'>
              <label htmlFor='confirm-password'>Confirm password</label>
              <input
                className='mt-2 px-3 py-2 border outline-none rounded'
                type='text'
                required
                placeholder='re-enter password to confirm'
                value={signUpForm.confirmPassword}
                onChange={(e) => {
                  setSignUpForm({
                    ...signUpForm,
                    confirmPassword: e.target.value,
                  });
                }}
                id='confirm-password'
              />
            </div>
            <button
              type='button'
              onClick={createUser}
              className='submit text-center bg-green-500 py-3 text-[12px] sm:text-[14px] text-white rounded w-full'
            >
              Submit
            </button>
            <p className='text-center text-[12px] sm:text-[14px] mt-4'>
              Have an account?{' '}
              <Link href='/' className='underline text-purple-800 '>
                log-in instead
              </Link>{' '}
            </p>
          </form>
        </div>
      </main>
    </>
  );
}

export default SignUpPage;
