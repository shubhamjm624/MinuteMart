const Contact = () => {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold border-b-2 border-white pb-2">Contact Us</h1>
        <p className="text-lg">
          Have questions or need support? We’re here to help!
        </p>
        <form className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div>
            <textarea
              rows={4}
              placeholder="Your Message"
              className="w-full p-3 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition duration-150"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
