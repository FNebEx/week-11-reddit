import { useRouter } from "next/router";
import { useState } from "react";

export default function NewComment({ post }) {
  const router = useRouter();
  const [content, setContent] = useState('');

  const handeSubmit = async (event) => {
    event.preventDefault();
    if (!content) {
      alert('Enter a comment');
      return;
    }

    await fetch('/api/comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        post: post.id,
      })
    });

    router.reload(window.location.pathname);
  }

  const handleContent = (event) => setContent(event.target.value);

  return (
    <form 
      onSubmit={handeSubmit}
      className="flex flex-col mt-10"
    >
      <textarea 
        onChange={handleContent}
        className='border border-gray-700 p-4 w-full text-lg font-medium bg-transparent outline-none color-primary'
        placeholder="Add a comment"
        rows={1}
        cols={50}
      />
      <div className='mt-5'>
        <button className='border border-gray-700 rounded-full px-8 py-2 mt-0 mr-8 font-bold' type="submit">
          Comment
        </button>
      </div>
    </form>
  );
};
