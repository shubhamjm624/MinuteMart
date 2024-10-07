"use client"

import { useState } from 'react';
import Link from 'next/link';
import { FiMenu, FiX } from 'react-icons/fi'; // Import icons for menu

const NonAuthenticatedHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="bg-black text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link href="/" className="hover:text-gray-400 transition duration-150">
            MinuteMart
          </Link>
        </div>

        {/* Hamburger menu icon for mobile */}
        <div className="md:hidden" onClick={toggleMenu}>
          {menuOpen ? (
            <FiX className="text-white text-3xl cursor-pointer" />
          ) : (
            <FiMenu className="text-white text-3xl cursor-pointer" />
          )}
        </div>

        {/* Navigation links for larger screens */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/about" className="hover:text-gray-400 transition duration-150">
            About
          </Link>
          <Link href="/contact" className="hover:text-gray-400 transition duration-150">
            Contact
          </Link>
          <Link href="/services" className="hover:text-gray-400 transition duration-150">
            Services
          </Link>
        </nav>

        {/* Login/Signup buttons for larger screens */}
        <div className="hidden md:flex space-x-4">
          <Link href="/buy" className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition duration-150">
            Login
          </Link>
          <Link href="/profile" className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition duration-150">
            Sign Up
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black text-white">
          <nav className="flex flex-col space-y-4 p-6">
            <Link href="/about" className="hover:text-gray-400 transition duration-150" onClick={toggleMenu}>
              About
            </Link>
            <Link href="/contact" className="hover:text-gray-400 transition duration-150" onClick={toggleMenu}>
              Contact
            </Link>
            <Link href="/services" className="hover:text-gray-400 transition duration-150" onClick={toggleMenu}>
              Services
            </Link>
            <Link href="/sign-in" className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition duration-150" onClick={toggleMenu}>
              Login
            </Link>
            <Link href="/sign-up" className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition duration-150" onClick={toggleMenu}>
              Sign Up
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NonAuthenticatedHeader;
