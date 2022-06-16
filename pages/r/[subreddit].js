import { Header } from "components/Header";
import Posts from "components/Posts";
import { getPostsFromSubreddit, getSubreddit } from "lib/data";
import prisma from "lib/prisma";

const Subreddit = ({ subreddit, posts }) => {
  if(!subreddit) return <p className='text-center p-5'>Subreddit does not exists 😋</p>

  return (
    <>
      <Header subreddit={subreddit}/>
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