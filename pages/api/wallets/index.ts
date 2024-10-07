import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const wallets = await prisma.wallet.findMany();
    res.status(200).json(wallets);
  } else if (req.method === 'POST') {
    const { userId, balance } = req.body;
    const newWallet = await prisma.wallet.create({
      data: { userId, balance },
    });
    res.status(201).json(newWallet);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
