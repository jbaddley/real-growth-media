import Link from "next/link";
import SignInButton from "./SignInButton";
import Image from "next/image";
import logo from "../assets/rgm-logo.png";

const Header = () => {
  return (
    <header className='flex h-24 flex-col justify-center bg-slate-900'>
      <nav className='container'>
        <ul className='flex items-center justify-between gap-8 font-medium tracking-wider text-stone-100'>
          <Image src={logo} alt='Real Growth Media' height={64} />
          <li className='text-sm'>
            <Link href='https://realgrowth.media'>Main Site</Link>
          </li>
          <li>
            <SignInButton />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
