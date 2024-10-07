import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check for the request method
  console.log('Received request method:', req.method);
  
  if (req.method === 'PUT') {
    const { cartId } = req.query; // Get cartId from the query
    const { productInCartToRemove } = req.body; // Extract product to remove from the request body

    console.log('Received cartId:', cartId);
    console.log('Product to remove:', productInCartToRemove);

    // Validate input
    if (!cartId || !productInCartToRemove || !productInCartToRemove.productInCartId) {
      console.log('Invalid request data: ', { cartId, productInCartToRemove });
      return res.status(400).json({ message: 'Invalid request data' });
    }

    try {
      // Ensure cartId is treated as a string
      const cartIdString = Array.isArray(cartId) ? cartId[0] : cartId;
      console.log('Using cartIdString:', cartIdString);

      // Remove the product from the cart
      const result = await prisma.productInCart.deleteMany({
        where: {
          id: productInCartToRemove.productInCartId,
          cartId: cartIdString, // Ensure we're deleting from the correct cart
        },
      });

      console.log('Delete operation result:', result);

      // Respond with success
      return res.status(200).json({ message: 'Product removed from cart successfully' });
    } catch (error) {
      console.error('Error removing product from cart:', error);
      return res.status(500).json({ message: 'Error removing product from cart', error });
    }
  } else {
    // Handle any other HTTP methods
    console.log('Method not allowed:', req.method);
    return res.setHeader('Allow', ['PUT']).status(405).end(`Method ${req.method} Not Allowed`);
  }
}
