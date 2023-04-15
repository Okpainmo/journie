import React from 'react';
import Image from 'next/image';
import AppWrapper from '@/components/layout/AppWrapper';
import AppBody from '@/components/layout/AppBody';
import sampleImage from '@/assets/images/sample.jpg';

function JobPage() {
  return (
    <AppWrapper>
      <AppBody>
        <div className='company-logo'>
          <Image
            src={sampleImage}
            alt='company-logo'
            className='w-[60px] h-[60px] rounded-[100%]'
          />
        </div>
        <div className='job-details'>
          <div className='role font-bold poppins'>Front-end Engineer</div>
          <div className='text-gray-400 flex flex-row'>
            <span className='company-details text-[10px]'>
              Facebook | Los Angeles, USA
            </span>
          </div>
          <div className='py-1 flex flex- gap-3'>
            <div className='rounded bg-gray-300 text-[10px] p-1'>full-time</div>
            <div className='rounded bg-gray-300 text-[10px] p-1'>Hybrid</div>
            <div className='rounded bg-gray-300 text-[10px] p-1'>$100,000</div>
          </div>
        </div>
      </AppBody>
    </AppWrapper>
  );
}

export default JobPage;
