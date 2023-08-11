"use client";
import { useContext, useEffect } from "react";
import Link from "next/link";
import { UserContext } from "../../lib/userContext";
export default function Login() {
  const { logout } = useContext(UserContext);
  useEffect(() => {
    logout();
  }, []);

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100'>
      <div className='rounded-xl bg-white p-6 shadow-md'>
        <h1 className='mb-4 text-2xl font-bold'>Thank you for using Pro Peak!</h1>
        <Link href={"/login"}>Log In Again</Link>
      </div>
    </div>
  );
}
