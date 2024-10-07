import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { walletId } = req.query; // Get walletId from request query

  console.log('Received request:', { walletId });

  // Validate walletId parameter
  if (typeof walletId !== 'string') {
    console.warn('Invalid walletId parameter:', walletId);
    return res.status(400).json({ message: 'Invalid walletId parameter' });
  }

  try {
    // Fetch transactions by walletId
    console.log('Fetching transactions with walletId:', walletId);
    const transactions = await prisma.transaction.findMany({
      where: { walletId: walletId },
    });

    // If no transactions are found, return a message
    if (transactions.length === 0) {
      console.info('No transactions found for walletId:', walletId);
      return res.status(404).json({ message: 'No transactions found for the given walletId' });
    }

    // If transactions are found, return the transaction details
    console.log('Transactions found:', { transactions });
    return res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions by walletId:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default handler;
