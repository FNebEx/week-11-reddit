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
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const loading = status === 'loading';

  if (loading) return null;

  if (!session) return <p className='text-center p-5'>Not logged in 🙄</p>;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title) {
      alert('Enter a title');
      return;
    }

    if (!content && !image) {
      alert('Enter some text in the post');
      return;
    }

    const body = new FormData();
    body.append('image', image);
    body.append('title', title);
    body.append('content', content);
    body.append('subreddit_name', subreddit.name);

    await fetch('/api/post',  {
      method: 'POST',
      body
    });

    router.push(`/r/${subreddit.name}`);
  }

  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].size > 3072000) {
        alert('Maximun size allowed is 3MB');
        return false;
      }

      setImage(event.target.files[0]);
      setImageURL(URL.createObjectURL(event.target.files[0]));
    }
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
            <div className='text-sm text-gray-600 '>
              <label className='relative font-medium cursor-pointer underline my-3 block'>
                {!image && <p>Upload an iamge</p>}
                <img src={imageURL} />
                <input 
                  onChange={handleImageUpload}
                  type="file" 
                  name="image"
                  accept="image/*"
                  className="hidden"
                />
              </label>
            </div>
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