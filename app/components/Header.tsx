"use client";
import SignInButton from "./SignInButton";
import logo from "../assets/rgm-logo.png";
import Image from "next/image";
import { Navbar } from "flowbite-react";
import { useAuth } from "@clerk/nextjs";

const Header = () => {
  const { isLoaded, isSignedIn } = useAuth();
  return (
    <Navbar fluid className='bg-black py-6'>
      <Navbar.Brand href='https://book.realgrowth.media'>
        <Image src={logo} alt='RGM Logo' height={48} />
      </Navbar.Brand>
      <div className='flex md:order-2'>
        <SignInButton />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active href='/'>
          <p>Home</p>
        </Navbar.Link>
        <Navbar.Link active href='/roas-calc'>
          <p>ROAS Calc</p>
        </Navbar.Link>
        <Navbar.Link active href='https://realgrowth.media'>
          <p>Learn More</p>
        </Navbar.Link>
        {isLoaded && isSignedIn ? (
          <>
            <Navbar.Link active href='/pro-peak-ai'>
              <p>Pro Peak AI</p>
            </Navbar.Link>
          </>
        ) : null}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
