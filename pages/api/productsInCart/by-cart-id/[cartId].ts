import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { cartId } = req.query; // Get cartId from request query

  console.log('Received request:', { cartId });

  // Validate cartId parameter
  if (typeof cartId !== 'string') {
    console.warn('Invalid cartId parameter:', cartId);
    return res.status(400).json({ message: 'Invalid cartId parameter' });
  }

  try {
    // Fetch productsInCart by cartId, including product details
    console.log('Fetching productsInCart with cartId:', cartId);
    const productsInCart = await prisma.productInCart.findMany({
      where: { cartId: cartId },
      include: { product: true }, // Adjust this based on your actual model structure
    });

    // If no productsInCart are found, return a message
    if (productsInCart.length === 0) {
      console.info('No productsInCart found for cartId:', cartId);
      return res.status(404).json({ message: 'No productsInCart found for the given cartId' });
    }

    // If productsInCart are found, return the productInCart details along with product info
    console.log('ProductsInCart found:', { productsInCart });
    return res.status(200).json(productsInCart);
  } catch (error) {
    console.error('Error fetching productsInCart by cartId:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default handler;
