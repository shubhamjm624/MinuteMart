import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const product = await prisma.product.findUnique({
      where: { id: String(id) },
    });
    res.status(200).json(product);
  } else if (req.method === 'PUT') {
    const { name, description, price, stock } = req.body;
    const updatedProduct = await prisma.product.update({
      where: { id: String(id) },
      data: { name, description, price, stock },
    });
    res.status(200).json(updatedProduct);
  } else if (req.method === 'DELETE') {
    await prisma.product.delete({ where: { id: String(id) } });
    res.status(204).end();
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
