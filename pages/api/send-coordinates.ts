import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Received request:', req.method);

  if (req.method === 'POST') {
    console.log('Handling POST request');
    const { startPoint, endPoint } = req.body;

    console.log('Received startPoint:', startPoint);
    console.log('Received endPoint:', endPoint);

    if (!startPoint || !endPoint) {
      console.log('Missing startPoint or endPoint');
      return res.status(400).json({ error: 'startPoint and endPoint are required' });
    }

    try {
      console.log('Sending coordinates to server...');
      const response = await fetch('http://localhost:4000/coordinates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startPoint, endPoint }),
      });

      if (!response.ok) {
        console.error('Failed to send coordinates to server', response.status, response.statusText);
        throw new Error('Failed to send coordinates to server');
      }

      const data = await response.json();
      console.log('Received response from server:', data);
      res.status(200).json(data);
    } catch (error) {
      console.error('Error communicating with server:', error);
      res.status(500).json({ error: 'Failed to communicate with server' });
    }
  } else {
    console.log(`Method ${req.method} Not Allowed`);
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
