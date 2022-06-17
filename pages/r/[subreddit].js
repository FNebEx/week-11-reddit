import { Header } from "components/Header";
import Posts from "components/Posts";
import { getPostsFromSubreddit, getSubreddit } from "lib/data";
import prisma from "lib/prisma";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

const Subreddit = ({ subreddit, posts }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  if (loading) return null;

  if(!subreddit) return <p className='text-center p-5'>Subreddit does not exists 😋</p>


  return (
    <>
      <Header subreddit={subreddit}/>

      {session && (
        <div className='mx-20 my-10'>
          {/* I might have to change this to a input:text */}
          {/* Reddit uses an input field that links to a new post page */}
          {/* https://flaviocopes.notion.site/Let-people-create-new-posts-ac51c97158ef48dba5cdd851b6eaeb35 */}
          <Link href={`/r/${subreddit.name}/submit`}>
            <a className='border-gray-800 border-2 rounded-full p-4 w-full'>Create Post</a>
          </Link>
        </div>
      )}
      <Posts posts={posts}/>
    </>
  );
}
 
export default Subreddit;

export async function getServerSideProps({ params }) {
  const subreddit = await getSubreddit(params.subreddit, prisma);
  let posts = await getPostsFromSubreddit(params.subreddit, prisma);
  posts = JSON.parse(JSON.stringify(posts));

  return {
    props: {
      subreddit, posts
    }
  }
}