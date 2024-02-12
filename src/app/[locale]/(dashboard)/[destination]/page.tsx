import React from 'react';

export default function Destination({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return (
    <div className='flex h-screen flex-col items-center justify-center'>
      <button className='flex flex-nowrap items-center justify-center rounded bg-blue-500 p-6 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50'>
        <img
          src='/authenticator.png'
          alt='Google Authenticator'
          className='mr-2 h-12 w-12'
        />
        Google Authenticator
      </button>
    </div>
  );
}
