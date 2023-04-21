import React, { useState } from 'react';
// import Link from 'next/link';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Popover } from '@headlessui/react';
import mockDP from '../assets/images/sample.jpg';

function NavPopOver() {
  // const [user, setUser] = useState({ name: '', email: '' });

  const features = [
    {
      name: 'My todos/Schedules',
      description: 'All your todos/schedules in one place.',
      href: '##',
      icon: IconOne,
    },
    {
      name: 'My Notes',
      description: 'All your notes in one place.',
      href: '##',
      icon: IconOne,
    },
    {
      name: 'My Jounal entries',
      description: 'All your jounalling in one place.',
      href: '##',
      icon: IconOne,
    },
    // {
    //   name: '',
    //   description: 'Create your own targeted content.',
    //   href: '##',
    //   icon: IconTwo,
    // },
    {
      name: 'You stats',
      description: 'Your Journie usage statistics.',
      href: '##',
      icon: IconThree,
    },
  ];

  const router = useRouter();

  const userName = sessionStorage.getItem('userName');
  const userEmail = sessionStorage.getItem('userEmail');

  function logOut() {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('userToken');
      sessionStorage.removeItem('userEmail');
    }

    setTimeout(() => {
      router.push('/');
    }, 1000);
  }

  // if (typeof window !== 'undefined') {

  //   if (userName && userEmail) {
  //     setUser({ name: userName, email: userEmail });
  //   }
  // }

  return (
    <Popover className='relative rounded'>
      <Popover.Button className='focus:outline-[0]'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-6 sm:w-8 sm:h-8 h-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25'
          />
        </svg>
      </Popover.Button>

      <Popover.Panel className='absolute z-20 min-w-[290px] min-h-[200px] rounded px-4 py-4 right-0 top-12 shadow flex flex-col justify-between bg-gray-100'>
        <div className='flex gap-4 items-center'>
          <Image
            src={mockDP}
            alt='user-profile-photo'
            className='rounded-full w-[50px] h-[50px]'
          />
          <div className='py-3'>
            <div className='font-bold poppins capitalize'>{userName}</div>
            <div className='text-gray-400 flex flex-row mt-1'>{userEmail}</div>
          </div>
        </div>
        <section className='mt-10'>
          <div className='flex flex-col gap-6'>
            <div className='relative flex flex-col lg:grid-cols-2 border-t border-b'>
              {features.map((item) => (
                <Link
                  key={item.name}
                  href='/profile'
                  className='-m-3 flex items-center rounded-lg px-3 my-3 transition duration-150 ease-in-out focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50'
                >
                  <div className='flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12'>
                    <item.icon aria-hidden='true' />
                  </div>
                  <div className='ml-4'>
                    <p className='text-sm font-medium text-gray-900'>
                      {item.name}
                    </p>
                    <p className='text-sm text-gray-500'>
                      {item.description} -{' '}
                      <span className='text-purple-500 text-[10px]'>
                        coming soon
                      </span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <div className='flex flex-col gap-2 mt-6 overflow-y-auto h-[150px]'>
              <h4 className='text-md poppins font-bold'>Features update</h4>
              <div className='text-gray-400'>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iusto
                natus ullam tempora architecto ducimus laboriosam, veniam quod
                provident libero, expedita, temporibus illum esse saepe facilis
                beatae quis. Nostrum repudiandae fuga aliquam, unde autem quis
                tempore vitae harum, laborum atque aspernatur odio ipsa, eos
                reprehenderit eaque earum. Unde vel animi voluptatibus provident
                excepturi labore aperiam optio tempora soluta, eius voluptatum
                veniam cumque velit, incidunt omnis. Culpa, numquam hic ipsa sit
                esse quia sapiente nam natus laudantium vel saepe dicta pariatur
                itaque, facilis commodi ab! Quam, incidunt quas consequuntur
                impedit numquam distinctio pariatur beatae eligendi suscipit
                labore fugit eius quisquam culpa consectetur?
              </div>
            </div>
          </div>
        </section>
        <section className='mt-6'>
          <div className='flex flex-row-reverse gap-4'>
            <button
              onClick={logOut}
              className='bg-green-500 rounded text-white px-3 py-2 text-[12px] min-w-[80px]'
            >
              log out
            </button>
          </div>
        </section>
      </Popover.Panel>
    </Popover>
  );
}

function IconOne() {
  return (
    <svg
      width='48'
      height='48'
      viewBox='0 0 48 48'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect width='48' height='48' rx='8' fill='#FFEDD5' />
      <path
        d='M24 11L35.2583 17.5V30.5L24 37L12.7417 30.5V17.5L24 11Z'
        stroke='#FB923C'
        strokeWidth='2'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M16.7417 19.8094V28.1906L24 32.3812L31.2584 28.1906V19.8094L24 15.6188L16.7417 19.8094Z'
        stroke='#FDBA74'
        strokeWidth='2'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M20.7417 22.1196V25.882L24 27.7632L27.2584 25.882V22.1196L24 20.2384L20.7417 22.1196Z'
        stroke='#FDBA74'
        strokeWidth='2'
      />
    </svg>
  );
}

function IconTwo() {
  return (
    <svg
      width='48'
      height='48'
      viewBox='0 0 48 48'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect width='48' height='48' rx='8' fill='#FFEDD5' />
      <path
        d='M28.0413 20L23.9998 13L19.9585 20M32.0828 27.0001L36.1242 34H28.0415M19.9585 34H11.8755L15.9171 27'
        stroke='#FB923C'
        strokeWidth='2'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M18.804 30H29.1963L24.0001 21L18.804 30Z'
        stroke='#FDBA74'
        strokeWidth='2'
      />
    </svg>
  );
}

function IconThree() {
  return (
    <svg
      width='48'
      height='48'
      viewBox='0 0 48 48'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect width='48' height='48' rx='8' fill='#FFEDD5' />
      <rect x='13' y='32' width='2' height='4' fill='#FDBA74' />
      <rect x='17' y='28' width='2' height='8' fill='#FDBA74' />
      <rect x='21' y='24' width='2' height='12' fill='#FDBA74' />
      <rect x='25' y='20' width='2' height='16' fill='#FDBA74' />
      <rect x='29' y='16' width='2' height='20' fill='#FB923C' />
      <rect x='33' y='12' width='2' height='24' fill='#FB923C' />
    </svg>
  );
}

export default NavPopOver;
