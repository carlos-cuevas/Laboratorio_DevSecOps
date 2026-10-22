export default function Content({ children }: { children: React.ReactNode }) {
  return <div className='flex-1 flex flex-col p-5'>{children}</div>;
}
