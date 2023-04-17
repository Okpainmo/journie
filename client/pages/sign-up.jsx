import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

function SignUpPage() {
  const [signUpForm, setSignUpForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  async function createUser(e) {
    e.preventDefault();

    console.log(signUpForm);

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

    const toastId = toast.loading('creating account...');

    const newUser = await axios.post(
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

    // if (newUser && newUser.data.requestStatus === 'user already exists') {
    //   toast.error('user already exists', {
    //     id: toastId,
    //     duration: 4000,
    //   });
    // }

    // if (newUser && newUser.data.requestStatus === 'error creating user') {
    //   toast.error('error creating user', {
    //     id: toastId,
    //     duration: 4000,
    //   });
    // }

    setSignUpForm({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  }

  return (
    <>
      <Toaster />
      <main className='login-page mx-3 px-3 pt-6 pb-10 mt-20 sm:mt-40 rounded border sm:w-[400px] sm:mx-auto'>
        <div className='flex sm:px-3 flex-col gap-8'>
          {/* <Link href='/'> */}
          <div className='logo-wrapper poppins font-bold text-purple-800 text-xl sm:text-3xl text-center'>
            Journie/sign up
          </div>
          {/* </Link> */}
          <form>
            <div className='input-group flex flex-col mb-6 text-[12px] sm:text-[14px]'>
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
            <div className='input-group flex flex-col mb-6 text-[12px] sm:text-[14px]'>
              <label htmlFor='email'>email</label>
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
              <label htmlFor='confirm-password'>Confirm Password</label>
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
              <Link href='/log-in' className='underline text-purple-800 '>
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
