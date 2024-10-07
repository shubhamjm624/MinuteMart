import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { clerkUserId } = req.query;  // Get clerkUserId from request query

  console.log('Received request:', { clerkUserId });

  if (typeof clerkUserId !== 'string') {
    console.warn('Invalid clerkUserId parameter:', clerkUserId);
    return res.status(400).json({ message: 'Invalid clerkUserId parameter' });
  }

  try {
    // Fetch user by Clerk User ID
    console.log('Fetching user with clerkUserId:', clerkUserId);
    const user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUserId },
    });

    // If user is not found, return a message
    if (!user) {
      console.info('User not found for clerkUserId:', clerkUserId);
      return res.status(404).json({ message: 'User with given clerk id not found' });
    }

    // If user is found, return user details
    console.log('User found:', { user });
    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      clerkUserId: user.clerkUserId,
    });
  } catch (error) {
    console.error('Error fetching user by clerkUserId:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default handler;
