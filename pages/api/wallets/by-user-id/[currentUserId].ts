import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { currentUserId } = req.query;  // Get currentUserId from request query

  console.log('Received request:', { currentUserId });

  if (typeof currentUserId !== 'string') {
    console.warn('Invalid currentUserId parameter:', currentUserId);
    return res.status(400).json({ message: 'Invalid currentUserId parameter' });
  }

  try {
    // Fetch wallet by Clerk Wallet ID
    console.log('Fetching wallet with currentUserId:', currentUserId);
    const wallet = await prisma.wallet.findUnique({
      where: { userId: currentUserId },
    });

    // If wallet is not found, return a message
    if (!wallet) {
      console.info('Wallet not found for currentUserId:', currentUserId);
      return res.status(404).json({ message: 'Wallet with given clerk id not found' });
    }

    // If wallet is found, return wallet details
    console.log('Wallet found:', { wallet });
    return res.status(200).json({
      id: wallet.id,
      balance: wallet.balance
    });
  } catch (error) {
    console.error('Error fetching wallet by currentUserId:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default handler;
