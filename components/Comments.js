import { useState } from "react";
import NewComment from "./NewComment";
import timeago from "lib/timeago";

const Comment = ({ comment, post }) => {
  const [reply, setReply] = useState(false);

  const handleShowReply = () => setReply(true);

  return (
    <div className="mt-6">
      <p>
        <span className="font-bold">{comment.author.name}</span> {timeago.format(new Date(comment.createdAt))}
      </p>
      <p>{comment.content}</p>

      {reply ? (
        <div className='pl-10'>
          <NewComment comment={comment} post={post} />
        </div>
      ) : (       
        <button onC lick={handleShowReply}>reply</button>
      )}
    </div>
  );
}

export default function Comments({ comments, post }) {
  if (!comments) return null;

  console.log(comments);
  /**
   * For some strange reason, the 
   * comments are coming back "null".
   * I'm not sure, because the comments 
   * were working the night before. I 
   * seriously cannot find out what is wrong here. 
   */
  return (
    <>
      {/* {comments.map(comment => (
        <Comment key={comment.id} comment={comment} post={post} />
      ))} */}
    </>
  );
};


