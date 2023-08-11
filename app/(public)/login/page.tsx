"use client";
import { magic } from "../../lib/magic";
import { useCallback, useContext, useState } from "react";
import { Fetcher } from "../../lib/fetcher";
import { UserContext } from "../../lib/userContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState<string>();
  const { user, setUser } = useContext(UserContext);

  const router = useRouter();
  const login = async (email: string) => {
    const didToken = await magic.auth.loginWithEmailOTP({ email });

    const { status } = await Fetcher.post(
      "/api/login",
      {},
      {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${didToken}`,
        },
      }
    );
    if (status === "success") {
      const userMetadata = await magic.user.getMetadata();
      setUser(userMetadata);
      router.push("/");
    }
  };

  const handleSendCode = useCallback(() => {
    login(email);
  }, [email]);

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100'>
      <div className='rounded-xl bg-white p-6 shadow-md'>
        <h1 className='mb-4 text-2xl font-bold'>Login to use Pro Peak</h1>
        <label htmlFor='email'>Email</label>
        <input name='email' type='email' value={email} onChange={({ target: { value } }) => setEmail(value)} />
        <button onClick={handleSendCode}>Send Magic Link</button>
      </div>
    </div>
  );
}
