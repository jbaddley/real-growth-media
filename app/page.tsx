"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className='flex h-full flex-col items-center justify-center bg-gray-100'>
      <h1 className='mb-4 text-4xl font-bold'>Welcome to Real Growth Media</h1>
      <p className='mb-12 text-lg text-gray-600'>Home of Pro Peak AI</p>
      <div className='flex flex-col md:space-x-0 md:space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0'>
        <Link
          href='/pro-peak-ai'
          className='flex h-16 w-64 items-center justify-center rounded-lg bg-blue-500 text-white transition hover:bg-blue-600'
        >
          Pro Peak AI
        </Link>

        <Link
          href='/https://realgrowth.media/learn-more'
          className='flex h-16 w-64 items-center justify-center rounded-lg bg-green-500 text-white transition hover:bg-green-600'
        >
          Learn More
        </Link>

        <Link
          href='/roas-calc'
          className='flex h-16 w-64 items-center justify-center rounded-lg bg-green-500 text-white transition hover:bg-green-600'
        >
          ROAS Calc
        </Link>
      </div>
    </div>
  );
}
