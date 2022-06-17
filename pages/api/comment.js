import prisma from "lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(501).end();
  }

  const session = await getSession({ req });

  if (!session) return res.status(401).json({ message: 'Not logged in' });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) return res.status(401).json({ message: 'User not found' });

  if (req.method === 'POST') {
    const { content, post } = req.body;
    const data = {
      content,
      post: {
        connect: {
          id: post
        }
      },
      author: {
        connect: {
          id: user.id
        }
      }
    }

    if (req.body.comment) {
      data.parent = {
        connect: {
          id: req.body.comment
        }
      }
    }

    const comment = await prisma.comment.create({ data: data });

    res.json(comment);
    return;
  }
};
