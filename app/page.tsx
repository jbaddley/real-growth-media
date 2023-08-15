"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gray-100'>
      <h1 className='mb-4 text-4xl font-bold'>Welcome to Pro Peak AI</h1>
      <p className='mb-12 text-lg text-gray-600'>A simple AI tool for creating marketing titles and copy</p>
      <div className='flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0'>
        <Link
          href='/pro-peak-ai'
          className='flex h-16 w-64 items-center justify-center rounded-lg bg-blue-500 text-white transition hover:bg-blue-600'
        >
          Pro Peak AI
        </Link>

        <Link
          href='/video-tutorial'
          className='flex h-16 w-64 items-center justify-center rounded-lg bg-green-500 text-white transition hover:bg-green-600'
        >
          Video Tutorial
        </Link>

        <Link
          href='/modern-digital-marketing-101'
          className='flex h-16 w-64 items-center justify-center rounded-lg bg-purple-500 text-white transition hover:bg-purple-600'
        >
          Modern Digital Advertising 101
        </Link>
      </div>
    </div>
  );
}
