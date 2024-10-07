import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const transactions = await prisma.transaction.findMany();
    res.status(200).json(transactions);
  } else if (req.method === 'POST') {
    const { walletId, amount, userId, typeOfTransaction } = req.body;

    // Validate required fields
    if (!walletId || typeof amount !== 'number' || !userId || !typeOfTransaction) {
      return res.status(400).json({ error: 'walletId, amount, userId, and typeOfTransaction are required' });
    }

    // Create the new transaction
    const newTransaction = await prisma.transaction.create({
      data: { 
        walletId, 
        amount, 
        userId,
        typeOfTransaction // Include the typeOfTransaction here
      },
    });

    res.status(201).json(newTransaction);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
