import { getPost, getSubreddit } from "lib/data";
import prisma from "lib/prisma";
import timeago from "lib/timeago";
import { Header } from "components/Header";
import NewComment from "components/NewComment";
import { useSession } from "next-auth/react";
import Comments from "components/Comments";


const Post = ({ subreddit, post }) => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  if (loading) return null;

  if (!post) return <p>Post does not exists 😛</p>;

  return (
    <>
      <Header subreddit={subreddit}/>

      <div className="flex flex-col mb-4 border border-3 border-black p-10 bg-gray-200 mx-20 my-10">
        <div className="flex flex-shrink-0 pb-0">
          <div className="flex-shrink-0 block group">
            <div className="flex items-center text-gray-800">
              Posted by {post.author.name}{' '}
              <p className="ml-2">
                { timeago.format(new Date(post.createdAt)) }
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <a className='flex-shrink text-2xl font-bold color-arimary width-auto'>{post.title}</a>
          <p className='flex-shrink text-base font-normal color-primary width-auto mt-2'>{post.content}</p>
        </div>

        { session ? (
          <NewComment post={post.commnets} />
        ) : (
          <p className='mt-5'>
            <a className='mr-1 underline' href='/api/auth/signin'>Login</a>
            to add a comment
          </p>
        )}

        <Comments comments={post.comments} />
      </div>
    </>
  );
}
 
export default Post;

export async function getServerSideProps({ params }) {
  const subreddit = await getSubreddit(params.subreddit, prisma);
  let post = await getPost(parseInt(params.id), prisma);
  post = JSON.parse(JSON.stringify(post));

  return {
    props: {
      subreddit, post
    }
  }
}
