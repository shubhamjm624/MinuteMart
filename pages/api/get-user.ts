import { NextApiRequest, NextApiResponse } from 'next';

// Define the User type
type User = {
  clerkId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
};

// Create 10 sample users
const users: User[] = [
  { clerkId: 'user_1', name: 'Alice Johnson', email: 'alice@example.com', phone: '123-456-7890', address: '123 Main St' },
  { clerkId: 'user_2mTmMidoyCLyIvjXuGa4YFXRJeT', name: 'Bob Smith', email: 'bob@example.com', phone: '234-567-8901', address: '456 Elm St' },
  { clerkId: 'user_3', name: 'Charlie Brown', email: 'charlie@example.com', phone: '345-678-9012', address: '789 Oak St' },
  { clerkId: 'user_4', name: 'Diana Prince', email: 'diana@example.com', phone: '456-789-0123', address: '101 Maple St' },
  { clerkId: 'user_5', name: 'Ethan Hunt', email: 'ethan@example.com', phone: '567-890-1234', address: '202 Birch St' },
  { clerkId: 'user_6', name: 'Fiona Gallagher', email: 'fiona@example.com', phone: '678-901-2345', address: '303 Pine St' },
  { clerkId: 'user_7', name: 'George Costanza', email: 'george@example.com', phone: '789-012-3456', address: '404 Cedar St' },
  { clerkId: 'user_8', name: 'Hannah Montana', email: 'hannah@example.com', phone: '890-123-4567', address: '505 Spruce St' },
  { clerkId: 'user_9', name: 'Ian Malcolm', email: 'ian@example.com', phone: '901-234-5678', address: '606 Fir St' },
  { clerkId: 'user_10', name: 'Jenna Marbles', email: 'jenna@example.com', phone: '012-345-6789', address: '707 Aspen St' },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { clerkId } = req.query;

  // Find the user with the specified clerkId
  const user = users.find(user => user.clerkId === clerkId);

  if (user) {
    return res.status(200).json(user);
  } else {
    return res.status(404).json({ message: 'User with clerkId not present in database' });
  }
}
