"use client";
import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/userContext";

const SignInButton = () => {
  const { user } = useContext(UserContext);
  return (
    <>
      {user?.email ? (
        <Link href={"/logout"}>{"Logout"}</Link>
      ) : (
        <Link className='rounded-md border border-stone-300 px-3 py-1 text-sm dark:border-stone-600' href={"/login"}>
          Sign In
        </Link>
      )}
    </>
  );
};

export default SignInButton;
