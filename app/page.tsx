"use client";
import Image from "next/image";
import pplogo from "./assets/ProPeakLogo.png";
import Link from "next/link";
export default function Home() {
  return (
    <section className='flex-row'>
      <h1>Welcome to Pro Peak</h1>
      <h2>A simple AI tool for creating marketing titles and copy</h2>
      <div>
        <Link href='/pro-peak-ai'>
          <Image src={pplogo} alt='Pro Peak Logo' />
          Use Our Pro Peak AI Tool
        </Link>
        <Link href='/tutorial'>Learn More</Link>
        <Link href='/moder-advertising-101'>Download Moder Advertising 101</Link>
      </div>
    </section>
  );
}
