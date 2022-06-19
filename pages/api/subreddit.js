import prisma from "lib/prisma";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.end();

  const { name, description } = req.body;

  const subreddits = await prisma.subreddit.findMany();
  console.log(subreddits);

  // Totally check to see if the subreddit name exists

  await prisma.subreddit.create({
    data: {
      name,
      description
    }
  });

  res.end();
};
