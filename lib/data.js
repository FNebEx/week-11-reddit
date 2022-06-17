export const getPosts = async (prisma) => {
  const posts = await prisma.post.findMany({
    where: {},
    orderBy: [
      { id: 'desc' }
    ],
    include: {
      author: true
    }
  });

  return posts;
};

export const getPost = async (id, prisma) => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
      comments: {
        where: {
          parentId: null,
        },
        orderBy: [
          { id: 'desc' }
        ],
        include: { author: true }
      }
    }
  });

  if (post.comments) {
    post.comments = await getCommentsOfComments(post.comments, prisma);
  }

  return post;
};

const getComments = async (parentId, prisma) => {
  let comments = await prisma.comment.findMany({
    where: {
      parentId
    },
    orderBy: [
      { id: 'desc' }
    ],
    include: { author: true }
  });

  if (comments.length) {
    comments = await getCommentsOfComments(comments, prisma);
  }

  return comments;
}

const getCommentsOfComments = async (comments, prisma) => {
  const getCommentsOfComment = async (comment, prisma) => {
    comment.comments = await getComments(comment.id, prisma);
  }

  return Promise.all(
    comments.map(comment => {
      comment = getCommentsOfComment(comment, prisma);
      return comment;
    })
  );
}

export const getSubreddit = async (name, prisma) => {
  return await prisma.subreddit.findUnique({
    where:{ name }
  });
};

export const getPostsFromSubreddit = async (subreddit, prisma) => {
  const posts = await prisma.post.findMany({
    where: {
      subreddit: { name: subreddit }
    },
    orderBy: [
      { id: 'desc' }
    ],
    include: { author: true }
  });

  return posts;
};

export const getVotes = async (post, prisma) => {
  const upvotes = await prisma.vote.count({
    where: {
      postId: post,
      up: true
    }
  });

  const downvote = await prisma.vote.count({
    where: {
      postId: post,
      up: false
    }
  });

  return upvotes - downvote;
};

export const getVote = async (postId, userId, prisma) => {
  const vote = await prisma.vote.findMany({
    where: {
      postId,
      authorId: userId
    }
  });

  if (vote.length === 0) return null;

  return vote[0];
};
