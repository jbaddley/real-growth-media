import Link from "next/link";
import SignInButton from "./SignInButton";
import Image from "next/image";
import logo from "../assets/SP.svg";

const Header = () => {
  return (
    <header className='flex h-24 flex-col justify-center bg-stone-100'>
      <nav className='container'>
        <ul className='flex items-center justify-between gap-8 font-medium tracking-wider text-stone-500'>
          <Image src={logo} alt='Simply Put logo' height={96} />
          <li className='text-sm'>
            <Link href='/'>Home</Link>
          </li>
          <li className='text-sm'>
            <Link href='/category'>Category</Link>
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
