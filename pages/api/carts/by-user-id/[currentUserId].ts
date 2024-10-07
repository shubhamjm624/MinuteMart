import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { currentUserId } = req.query; // Get currentUserId from request query

  console.log('Received request:', { currentUserId });

  if (typeof currentUserId !== 'string') {
    console.warn('Invalid currentUserId parameter:', currentUserId);
    return res.status(400).json({ message: 'Invalid currentUserId parameter' });
  }

  try {
    // Fetch cart by userId
    console.log('Fetching cart with currentUserId:', currentUserId);
    const cart = await prisma.cart.findFirst({
      where: { userId: currentUserId },
    });

    // If cart is not found, return a message
    if (!cart) {
      console.info('Cart not found for currentUserId:', currentUserId);
      return res.status(404).json({ message: 'Cart with given clerk id not found' });
    }

    // If cart is found, return cart details
    console.log('Cart found:', { cart });
    return res.status(200).json({
      id: cart.id
    });
  } catch (error) {
    console.error('Error fetching cart by currentUserId:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default handler;
