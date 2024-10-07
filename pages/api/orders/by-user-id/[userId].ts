import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query; // Get userId from request query

  console.log('Received request:', { userId });

  // Validate userId parameter
  if (typeof userId !== 'string') {
    console.warn('Invalid userId parameter:', userId);
    return res.status(400).json({ message: 'Invalid userId parameter' });
  }

  try {
    // Fetch orders by userId
    console.log('Fetching orders with userId:', userId);
    const orders = await prisma.order.findMany({
      where: { userId: userId },
    });

    // If no orders are found, return a message
    if (orders.length === 0) {
      console.info('No orders found for userId:', userId);
      return res.status(404).json({ message: 'No orders found for the given userId' });
    }

    // If orders are found, return the order details
    console.log('Orders found:', { orders });
    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders by userId:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default handler;
