import prisma from "lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) return res.end();

  if (req.method === 'POST') {
    const { name } = req.body;
    console.log(name);

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name
      }
    });

    res.end();
  }
}