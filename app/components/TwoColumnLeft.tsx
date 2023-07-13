export default function TwoColumnLeft({ children }: { children: React.ReactNode }) {
  return (
    <div className='mx-auto flex h-screen w-full max-w-screen-md'>
      <div className='w-1/4 overflow-auto p-4'>{children[0]}</div>
      <div className='w-3/4 p-4'>{children[1]}</div>
    </div>
  );
}
