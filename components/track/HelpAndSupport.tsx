"use client"

const HelpAndSupport: React.FC = () => {

 

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Need Help?</h2>
      <p className="text-gray-600 mb-6">We are here to assist you with any issues or questions.</p>
      
      <button
        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      >
        Go to Help & Support
      </button>
    </div>
  );
};

export default HelpAndSupport;
