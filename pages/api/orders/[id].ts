import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const order = await prisma.order.findUnique({
      where: { id: String(id) },
      include: { products: true },
    });
    res.status(200).json(order);
  } else if (req.method === 'PUT') {
    const { products, totalAmount } = req.body;
    const updatedOrder = await prisma.order.update({
      where: { id: String(id) },
      data: {
        totalAmount,
        products: {
          create: products,
        },
      },
    });
    res.status(200).json(updatedOrder);
  } else if (req.method === 'DELETE') {
    await prisma.order.delete({ where: { id: String(id) } });
    res.status(204).end();
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
