import Posts from "components/Posts";
import { getPostsFromUser, getUser } from "lib/data"
import prisma from "lib/prisma";
import Link from "next/link";

export default function Profile({ user, posts }) {
  if (!user) return <p>No user</p>;
  
  return (
    <>
      <div className='bg-black text-white h-12 flex pt-3 px-5 pb-2'>
        <Link href={'/'}>
          <a className="underline">Home</a>
        </Link>
          <p className="grow"></p>
        <div className='bg-black text-white h-12 flex pt-3 px-5 pb-2'>
          <p className="text-center">/u/{user.name}</p>
        </div>
      </div>
      <Posts posts={posts} />
    </>
  )
};

export async function getServerSideProps({ params }) {
  let user = await getUser(params.name, prisma);
  user = JSON.parse(JSON.stringify(user));

  let posts = await getPostsFromUser(params.name, prisma);
  posts = JSON.parse(JSON.stringify(posts));

  return {
    props: {
      user, posts
    }
  }
}