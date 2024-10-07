import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const transaction = await prisma.transaction.findUnique({
      where: { id: String(id) },
    });
    res.status(200).json(transaction);
  } else if (req.method === 'DELETE') {
    await prisma.transaction.delete({ where: { id: String(id) } });
    res.status(204).end();
  } else {
    res.setHeader('Allow', ['GET', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
