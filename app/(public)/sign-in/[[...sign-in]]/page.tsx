import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className='content-center'>
      <SignIn />
    </div>
  );
}
