/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:4000'; // Replace with your server URL

export const useSocket = () => {
  const [socket, setSocket] = useState<any>(null);
  const [routePosition, setRoutePosition] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    console.log('Initializing socket connection...');
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
    });

    newSocket.on('routePosition', (position: { lat: number; lng: number }) => {
      console.log('Received routePosition:', position);
      setRoutePosition(position);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      console.log('Cleaning up socket connection...');
      newSocket.disconnect();
    };
  }, []);

  return { socket, routePosition };
};
