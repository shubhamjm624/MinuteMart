import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const orders = await prisma.order.findMany();
    res.status(200).json(orders);
  } else if (req.method === 'POST') {
    const { userId, products, totalAmount, status } = req.body; // Add 'status' here
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const newOrder = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        status, // Include 'status' in the data object
        products: {
          create: products,
        },
      },
    });
    res.status(201).json(newOrder);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
