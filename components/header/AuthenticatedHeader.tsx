"use client"

import { useState } from 'react';
import Link from 'next/link';
import { FiMenu, FiX } from 'react-icons/fi'; // Import icons for menu
import { useClerk } from '@clerk/nextjs'; // Import useClerk hook


const AuthenticatedHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signOut } = useClerk();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    signOut(() => {
      window.location.href = '/home';
    });
  };

  return (
    <header className="bg-black text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="text-2xl font-bold">
          <Link href="/" className="hover:text-gray-400 transition duration-150">
            MinuteMart
          </Link>
        </div>

        <div className="md:hidden" onClick={toggleMenu}>
          {menuOpen ? (
            <FiX className="text-white text-3xl cursor-pointer" />
          ) : (
            <FiMenu className="text-white text-3xl cursor-pointer" />
          )}
        </div>

        <nav className="hidden md:flex space-x-6">
          <Link href="/my-cart" className="hover:text-gray-400 transition duration-150">
            My Cart
          </Link>
          <Link href="/my-wallet" className="hover:text-gray-400 transition duration-150">
            My Wallet
          </Link>
          <Link href="/my-orders" className="hover:text-gray-400 transition duration-150">
            My Orders
          </Link>
          <Link href="/my-profile" className="hover:text-gray-400 transition duration-150">
            My Profile
          </Link>
          <Link href="/buy" className="hover:text-gray-400 transition duration-150">
            Shop
          </Link>
        </nav>

        <div className="hidden md:flex space-x-4">
          <Link href="/home" onClick={handleLogout} className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition duration-150">
            Log Out
          </Link>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-black text-white">
          <nav className="flex flex-col space-y-4 p-6">
            <Link href="/my-cart" className="hover:text-gray-400 transition duration-150" onClick={toggleMenu}>
              My Cart
            </Link>
            <Link href="/my-wallet" className="hover:text-gray-400 transition duration-150" onClick={toggleMenu}>
              My Wallet
            </Link>
            <Link href="/my-orders" className="hover:text-gray-400 transition duration-150" onClick={toggleMenu}>
              My Orders
            </Link>
            <Link href="/my-profile" className="hover:text-gray-400 transition duration-150" onClick={toggleMenu}>
              My Profile
            </Link>
            <Link href="/buy" className="hover:text-gray-400 transition duration-150" onClick={toggleMenu}>
              Shop
            </Link>
            <Link href="/home" onClick={handleLogout} className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition duration-150">
              Log Out
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default AuthenticatedHeader;
