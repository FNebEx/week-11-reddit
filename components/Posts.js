import Post from "./Post";

const Posts = ({ posts }) => {
  if (!posts)
    return null;

  return (
    <>
      {posts.map((post) => <Post key={post.id} post={post} />)}
    </>
  );
};

export default Posts;