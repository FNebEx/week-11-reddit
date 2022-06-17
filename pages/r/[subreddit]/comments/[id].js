import { getPost, getSubreddit, getVote, getVotes } from "lib/data";
import prisma from "lib/prisma";
import timeago from "lib/timeago";
import { Header } from "components/Header";
import NewComment from "components/NewComment";
import { getSession, useSession } from "next-auth/react";
import Comments from "components/Comments";
import { useRouter } from "next/router";


const Post = ({ subreddit, post, vote, votes }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const loading = status === 'loading';

  const sendVote = async (up) => {
    await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        post: post.id, 
        up
      })
    });

    router.reload(window.location.pathname);
  }

  const handleUpvote = (event) => {
    event.preventDefault();
    sendVote(true);
  }

  const handleDownvote = (event) => {
    event.preventDefault();
    sendVote(false);
  }

  if (loading) return null;

  if (!post) return <p>Post does not exists 😛</p>;

  return (
    <>
      <Header subreddit={subreddit}/>
      <div className='flex flex-row mb-4 px-10 justify-center'>
        <div className="flex flex-col mb-4 border-t border-l border-b border-3">
          <button
            onClick={handleUpvote}
            className='cursor-pointer'
          >
            {vote?.up ? "🔼" : "⬆"}
          </button>
          <div>{votes}</div>
          <button
            onClick={handleDownvote}
            className='cursor-pointer'
          >
            {!vote ? '🔽' : '⬇'}
          </button>
        </div>
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
      </div>
    </>
  );
}
 
export default Post;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const subreddit = await getSubreddit(context.params.subreddit, prisma);

  let post = await getPost(parseInt(context.params.id), prisma);
  post = JSON.parse(JSON.stringify(post));
  
  let votes = await getVotes(parseInt(context.params.id), prisma);
  votes = JSON.parse(JSON.stringify(votes));

  let vote = await getVote(
    parseInt(context.params.id),
    session?.user.id,
    prisma
  );
	vote = JSON.parse(JSON.stringify(vote));

  return {
    props: {
      subreddit, post, vote, votes
    }
  }
}
