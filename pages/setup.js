import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from 'react';

const Setup = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState('');
  const loading = status === 'loading';

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch('/api/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });

    session.user.name = name;
    router.push('/');
  };

  const handleOnChange = (e) => setName(e.target.value);

  if (loading) return null;

  if (!session || !session.user) {
    router.push('/');
    return null;
  }

  if (!loading && session && session.user.name) {
    router.push('/');
  }

  return (
    <form onSubmit={handleSubmit} className='mt-10 ml-20'>
      <div className="flex-1 mb-5">
        <div className="flex-1 mb-5">Choose a username</div>
        <input 
          onChange={handleOnChange}
          className='border p-1' 
          type="text" 
          name="name"
          value={name}
          required
          pattern="\w*"
          title="Numbers or letters or _ only"
          placeholder="Numbers or letters or _ only"
          minLength={5}
        />
      </div>
      <button type="submit" className="border px-8 py-2 mt-0 mr-8 font-bold rounded-full color-accent-contrast bg-color-accent hover:bg-color-accent-hover">
        Save
      </button>
    </form>
  );
}
 
export default Setup;