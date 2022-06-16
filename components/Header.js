import Link from "next/link";

export const Header = ({ subreddit }) => {
  return (
    <>
      <div className='bg-black text-white h-12 flex pt-3 px-5 pb-2'>
        <Link href={'/'}>
          <a>Home</a>
        </Link>
        <p className="grow"></p>
      </div>
      <div className='bg-black text-white h-12 flex pt-3 px-5 pb-2'>
        <p className="text-center">/r/{subreddit.name}</p>
        <p className="ml-4 text-left grow">{subreddit.description}</p>
      </div>
    </>
  ); 
};
