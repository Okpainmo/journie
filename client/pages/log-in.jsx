import React, { useState } from 'react';
import Link from 'next/link';

function LoginPage() {
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  return (
    <main className='login-page mx-3 px-3 pt-6 pb-10 mt-28 rounded border sm:w-[400px] sm:mx-auto'>
      <div className='flex flex-col px-3 gap-8'>
        {/* <Link href='/'> */}
        <div className='logo-wrapper poppins font-bold text-purple-800 text-xl sm:text-3xl text-center'>
          Journie/login
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
              value={loginForm.username}
              onChange={(e) => {
                setLoginForm({
                  ...loginForm,
                  username: e.target.value,
                });
              }}
              name='postTags'
              id='postTags'
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
              name='postTags'
              id='postTags'
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

export default LoginPage;
