import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`Received ${req.method} request at /api/carts`);

  if (req.method === 'GET') {
    try {
      console.log('Fetching all carts from the database...');
      const carts = await prisma.cart.findMany();
      console.log('Carts fetched successfully:', carts);
      res.status(200).json(carts);
    } catch (error) {
      console.error('Error fetching carts:', error);
      res.status(500).json({ message: 'Error fetching carts' });
    }
  } else if (req.method === 'POST') {
    const { userId, products } = req.body;
    console.log('POST request data:', { userId, products });

    try {
      console.log('Creating a new cart...');
      const newCart = await prisma.cart.create({
        data: {
          userId,
          products: {
            create: products,
          },
        },
      });
      console.log('New cart created successfully:', newCart);
      res.status(201).json(newCart);
    } catch (error) {
      console.error('Error creating cart:', error);
      res.status(500).json({ message: 'Error creating cart' });
    }
  } else {
    console.warn(`Method ${req.method} not allowed`);
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
