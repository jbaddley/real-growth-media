import Link from "next/link";
import SignInButton from "./SignInButton";
import logo from "../assets/rgm-logo.png";
import Image from "next/image";

const Header = () => {
  return (
    <header className='flex h-24 flex-col justify-center bg-black'>
      <nav className='container flex p-4'>
        <ul className='flex grow gap-8 font-medium tracking-wider text-stone-100'>
          <li>
            <Link href='https://realgrowth.media'>
              <Image src={logo} alt='RGM Logo' height={48} />
            </Link>
          </li>
          <li className='py-4'>
            <Link className='leading-6' href='/'>
              Home
            </Link>
          </li>
          <li className='py-4'>
            <Link className='leading-6' href='/pro-peak-ai'>
              Pro Peak AI
            </Link>
          </li>
          <li className='py-4'>
            <Link className='leading-6' href='/video-tutorial'>
              Tutorial
            </Link>
          </li>
          <li className='py-4'>
            <Link className='leading-6' href='/modern-digital-marketing-101'>
              Digital Marketing 101
            </Link>
          </li>
        </ul>
        <div className='py-4'>
          <SignInButton />
        </div>
      </nav>
    </header>
  );
};

export default Header;
