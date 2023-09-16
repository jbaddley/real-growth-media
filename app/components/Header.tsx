"use client";
import logo from "../assets/rgm-logo.png";
import Image from "next/image";
import { Navbar } from "flowbite-react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import Button from "./Button";
import { FaPhone } from "react-icons/fa";

const Header = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const handleCopy = () => {
    navigator.clipboard.writeText("8015084303").then(
      () => {
        console.log(`Copied ${"8015084303"}`);
      },
      () => {
        console.error(`Failed to copy ${"8015084303"}`);
      }
    );
  };
  return (
    <Navbar fluid className='bg-black py-6'>
      <Navbar.Brand href='https://homeservices.realgrowth.media/book-a-free-consultation'>
        <Image src={logo} alt='RGM Logo' height={48} />
      </Navbar.Brand>
      <div className='flex md:order-2'>
        <a onClick={handleCopy} className='mx-4 my-2 text-white' href='tel:8015084303'>
          801-508-4303
        </a>
        <Link
          className='text-white'
          target='blank'
          href='https://homeservices.realgrowth.media/book-a-free-consultation'
        >
          <Button>Book a Call</Button>
        </Link>
      </div>
      <Navbar.Collapse></Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
