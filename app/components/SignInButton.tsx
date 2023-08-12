"use client";
import { UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";

const SignInButton = () => {
  const { isLoaded, isSignedIn } = useAuth();
  return <>{isLoaded && isSignedIn ? <UserButton afterSignOutUrl='/' /> : <Link href='/sign-in'>Sign In</Link>}</>;
};

export default SignInButton;
