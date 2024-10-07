/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

interface UserData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const MyProfile: React.FC = () => {
  const { userId } = useAuth();
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`);
    setUserData(prevState => ({ ...prevState, [name]: value }));
  };

  const createWalletAndCart = async (userId: string) => {
    try {
      // Create wallet for user
      const walletResponse = await fetch('/api/wallets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      const walletData = await walletResponse.json();
      console.log('Wallet created:', walletData);

      // Create cart for user
      const cartResponse = await fetch('/api/carts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, products: [] }), // Assuming an empty cart on creation
      });
      const cartData = await cartResponse.json();
      console.log('Cart created:', cartData);
    } catch (err) {
      console.error('Error creating wallet or cart:', err);
    }
  };

  const toggleEdit = async () => {
    if (isEditing) {
      try {
        console.log('Saving user data:', userData);
        
        // Prepare the request body
        const requestBody = {
          clerkUserId: userId,
          ...userData,
        };

        if (!isOnboarded) {
          // Send POST request to create new user data
          console.log('Creating new user data:', requestBody);
          const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });

          // Handle the response
          const data = await response.json();
          console.log('Response data:', data);

          if (response.ok) {
            setUserData(data); // Autofill the form with updated data
            setSuccessMessage('User data saved successfully!');

            console.log('User is created successfully, now creating wallet and cart...');
            await createWalletAndCart(data.id); // Assuming data.id is the created user's ID

          } else {
            setSuccessMessage(null);
            setError(data.message || 'Failed to save user data');
            console.error('Save error:', data.message);
          }
        } else {
          // Send PUT request to update existing user data
          console.log('Updating existing user data for userId:', userId);
          const response = await fetch(`/api/users/${userId}`, { // Assuming `userId` is the id in the URL
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });

          // Handle the response
          const data = await response.json();
          console.log('Response data:', data);

          if (response.ok) {
            setUserData(data); // Autofill the form with updated data
            setSuccessMessage('User data updated successfully!');
          } else {
            setSuccessMessage(null);
            setError(data.message || 'Failed to update user data');
            console.error('Update error:', data.message);
          }
        }
      } catch (err) {
        setError('An error occurred while saving user data');
        console.error('Error saving user data:', err);
      }
    }
    
    // Toggle editing state
    setIsEditing(!isEditing);
    console.log('Editing mode:', !isEditing);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      console.log('Fetching user data for userId:', userId);
      try {
        if (!userId) {
          console.warn('No userId found. Aborting fetch.');
          return;
        }

        const response = await fetch(`/api/users/by-clerk-id/${userId}`);
        const data = await response.json();
        console.log('Fetched user data:', data);

        if (response.ok) {
          setIsEditing(true);
          setIsOnboarded(true);
          setUserData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
          });
          console.log('User data set:', userData);
        } else {
          if (data.message === 'User with given clerk id not found') {
            setIsOnboarded(false);
            setIsEditing(true);
            alert('User not found, setting isEditing to true');
          } else {
            setError(data.message || 'Failed to fetch user data');
            console.error('Fetch error:', data.message);
          }
        }
      } catch (err) {
        setError('An error occurred while fetching user data');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
        console.log('Loading finished');
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">My Profile</h1>
        
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
            {error && <div className="text-red-500 text-center mb-4">{error}</div>}
            {successMessage && <div className="text-green-500 text-center mb-4">{successMessage}</div>}

            <form className="space-y-6">
              {['name', 'email', 'phone', 'address'].map((field) => (
                <div key={field} className="flex justify-between items-center border-b border-gray-300 pb-4">
                  <label className="text-lg font-semibold">{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                  {isEditing ? (
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      name={field}
                      value={userData[field as keyof UserData]}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg p-2 w-2/3 ml-4"
                    />
                  ) : (
                    <span className="text-gray-700">{userData[field as keyof UserData]}</span>
                  )}
                </div>
              ))}
            </form>

            <div className="flex justify-center mt-8">
              <button
                onClick={toggleEdit}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition duration-200"
              >
                {isEditing ? 'Save' : 'Edit Profile'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
