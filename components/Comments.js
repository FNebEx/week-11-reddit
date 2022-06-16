const { default: timeago } = require("lib/timeago");

const Comment = ({ comment }) => {
  return (
    <div className="mt-6">
      <p>
        <span className="font-bold">{comment.author.name}</span> {timeago.format(new Date(comment.createdAt))}
      </p>
      <p>{comment.content}</p>
    </div>
  );
}

export default function Comments({ comments }) {
  if (!comments) return null;

  return (
    <>
      {comments.map(comment => <Comment key={comment.id} comment={comment} />)}
    </>
  );
};


