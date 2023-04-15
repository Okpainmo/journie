import React, { useState } from 'react';
import Link from 'next/link';

function SignUpPage() {
  const [signUpForm, setSignUpForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  return (
    <main className='login-page mx-3 px-3 pt-6 pb-10 mt-28 rounded border sm:w-[400px] sm:mx-auto'>
      <div className='flex flex-col px-3 gap-8'>
        {/* <Link href='/'> */}
        <div className='logo-wrapper poppins font-bold text-purple-800 text-xl sm:text-3xl text-center'>
          Journie/sign up
        </div>
        {/* </Link> */}
        <form clasName='flex'>
          <div className='input-group flex flex-col mb-6 text-[12px] sm:text-[14px]'>
            <label htmlFor='username'>Username</label>
            <input
              className='mt-2 px-3 py-2 border outline-none rounded'
              type='text'
              required
              placeholder='please input your username'
              value={signUpForm.username}
              onChange={(e) => {
                setSignUpForm({
                  ...loginForm,
                  username: e.target.value,
                });
              }}
              id='username'
            />
          </div>
          <div className='password input-group flex flex-col mb-6 text-[12px] sm:text-[14px]'>
            <label htmlFor='password'>Password</label>
            <input
              className='mt-2 px-3 py-2 border outline-none rounded'
              type='password'
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
              type='confirm-password'
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
            className='submit text-center bg-green-500 py-3 text-[12px] sm:text-[14px] text-white rounded w-full'
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}

export default SignUpPage;
