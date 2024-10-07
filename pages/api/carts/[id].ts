import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // Log the request method and id
  console.log(`Request Method: ${req.method}`);
  console.log(`Cart ID: ${id}`);

  try {
    if (req.method === 'GET') {
      // Log that GET request processing has started
      console.log('Processing GET request...');
      const cart = await prisma.cart.findUnique({
        where: { id: String(id) },
        include: { products: true },
      });

      // Log the fetched cart data
      console.log('Fetched Cart:', cart);
      res.status(200).json(cart);
    } else if (req.method === 'PUT') {
      const { products } = req.body;

      // Log the incoming products for the PUT request
      console.log('Processing PUT request...');
      console.log('Products to add:', products);

      const updatedCart = await prisma.cart.update({
        where: { id: String(id) },
        data: { products: { create: products } },
      });

      // Log the updated cart data
      console.log('Updated Cart:', updatedCart);
      res.status(200).json(updatedCart);
    } else if (req.method === 'DELETE') {
      // Log that DELETE request processing has started
      console.log('Processing DELETE request...');
      await prisma.cart.delete({ where: { id: String(id) } });

      // Log successful deletion
      console.log(`Cart with ID ${id} deleted`);
      res.status(204).end();
    } else {
      // Log unsupported method
      console.log(`Unsupported method: ${req.method}`);
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    // Log any errors encountered
    console.error('Error:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}
