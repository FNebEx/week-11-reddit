import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function CreateSubreddit() {
  const { data: session } = useSession();
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleNameChange = (event) => setName(event.target.value);
  const handleDescriptionChange = (event) => setDescription(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();

    await fetch('/api/subreddit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description })
    });

    router.push('/');
  }

  if (!session) return <p>Login to create a new subreddit.</p>;

  return (
    <div>
      <h3>Create a subreddit</h3>
      <form onSubmit={handleSubmit}>
        <input 
          onChange={handleNameChange}
          className="border block"
          placeholder="subreddit name"
          type="text"
          />
        <textarea 
          onChange={handleDescriptionChange}
          className="border block"
          cols="30" 
          rows="10" 
          />
        <button className="border px-4" type="submit">Create</button>
      </form>
      <p>{description}</p>
    </div>
  );
};
