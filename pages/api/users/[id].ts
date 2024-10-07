// /pages/api/users/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  console.log(`Received request with method: ${req.method} and ID: ${id}`);

  if (!id || typeof id !== 'string') {
    console.warn('Invalid user ID received:', id);
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  if (req.method === 'GET') {
    console.log(`Fetching user with ID: ${id}`);
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        console.warn(`User not found for ID: ${id}`);
        return res.status(404).json({ error: 'User not found' });
      }

      console.log(`User found:`, user);
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'PUT') {
    console.log(`Updating user with ID: ${id}`);
    const { clerkUserId, name, email, phone, address } = req.body;

    console.log('Request body:', { clerkUserId, name, email, phone, address });

    try {
      const updatedUser = await prisma.user.update({
        where: { clerkUserId: id },
        data: {
          clerkUserId,
          name,
          email,
          phone,
          address,
        },
      });

      console.log('User updated successfully:', updatedUser);
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'DELETE') {
    console.log(`Deleting user with ID: ${id}`);
    try {
      await prisma.user.delete({
        where: { id },
      });

      console.log(`User with ID: ${id} deleted successfully.`);
      res.status(204).end(); // No content to return
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    console.warn(`Method ${req.method} not allowed`);
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
