import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const wallet = await prisma.wallet.findUnique({
      where: { id: String(id) },
    });
    res.status(200).json(wallet);
  } else if (req.method === 'PUT') {
    const { balance } = req.body;
    const updatedWallet = await prisma.wallet.update({
      where: { id: String(id) },
      data: { balance },
    });
    res.status(200).json(updatedWallet);
  } else if (req.method === 'DELETE') {
    await prisma.wallet.delete({ where: { id: String(id) } });
    res.status(204).end();
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
