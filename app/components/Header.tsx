"use client";
import SignInButton from "./SignInButton";
import logo from "../assets/rgm-logo.png";
import Image from "next/image";
import { Navbar } from "flowbite-react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import Button from "./Button";

const Header = () => {
  const { isLoaded, isSignedIn } = useAuth();
  return (
    <Navbar fluid className='bg-black py-6'>
      <Navbar.Brand href='https://book.realgrowth.media'>
        <Image src={logo} alt='RGM Logo' height={48} />
      </Navbar.Brand>
      <div className='flex md:order-2'>
        <Link className='text-white' target='blank' href='https://freetraining.realgrowth.media/free-calc-booking'>
          <Button>Book a Call</Button>
        </Link>
      </div>
      <Navbar.Collapse></Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
