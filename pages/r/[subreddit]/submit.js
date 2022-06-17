import { Header } from "components/Header";
import { getSubreddit } from "lib/data";
import prisma from "lib/prisma";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Submit({ subreddit }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const loading = status === 'loading';

  if (loading) return null;

  if (!session) return <p className='text-center p-5'>Not logged in 🙄</p>;

  const handleSubmit = async (event) => {
    event.prevntDefault();

    if (!title) {
      alert('Enter a title');
      return;
    }

    if (!content) {
      alert('Enter some text in the post');
      return;
    }

    await fetch('/api/post',  {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, subreddit_name: subreddit.name })
    });

    router.push(`/r/${subreddit.name}`);
  }

  const handleTitleChange = (event) => setTitle(event.target.value);
  const handleContentChange = (event) => setContent(event.target.value);

  if (!subreddit) return <p className='text-center p-5'>Subreddit does not exist 😫</p>;

  return (
    <>
      <Header subreddit={subreddit}/>

      <div className='flex flex-row mb-4  px-10 justify-center'>
        <div className="flex flex-col mb-4 border border-3 border-black p-10 bg-gray-200 my-10">
          <form
            onSubmit={handleSubmit}
            className='flex flex-col'
            placeholder="The post title"
          >
            <h2 className='text-2xl font-bold mb-8'>Create a post</h2>
            <input 
              onChange={handleTitleChange}
              className="border border-gray-700 border-b-0 p-4 w-full text-lg font-medium bg-transparent outline-none" 
              type="text" 
              placeholder="The post content"
            />
            <textarea 
              onChange={handleContentChange}
              className='border border-gray-700 p-4 w-full text-lg font-medium bg-transparent outline-none'
              rows={5} 
              cols={50} 
            />
            <div className='mt-5'>
              <button className='border border-gray-700 rounded-full px-8 py-2 mt-0 mr-8 font-bold '>
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
};

export async function getServerSideProps({ params }) {
  const subreddit = await getSubreddit(params.subreddit, prisma);

  return {
    props: {
      subreddit
    }
  }
}