const Services = () => {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl text-center space-y-8">
        <h1 className="text-4xl font-bold border-b-2 border-white pb-2">Our Services</h1>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="border border-white p-6 rounded-lg hover:bg-gray-800 transition duration-150">
            <h2 className="text-xl font-semibold">Fast Delivery</h2>
            <p className="mt-2 text-lg">
              Get your groceries delivered to your doorstep in under 10 minutes!
            </p>
          </div>
          <div className="border border-white p-6 rounded-lg hover:bg-gray-800 transition duration-150">
            <h2 className="text-xl font-semibold">Fresh Groceries</h2>
            <p className="mt-2 text-lg">
              We offer fresh produce, dairy, and all your grocery needs, straight from local vendors.
            </p>
          </div>
          <div className="border border-white p-6 rounded-lg hover:bg-gray-800 transition duration-150">
            <h2 className="text-xl font-semibold">Easy Payments</h2>
            <p className="mt-2 text-lg">
              Secure and hassle-free payments with various options including cards, wallets, and UPI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
