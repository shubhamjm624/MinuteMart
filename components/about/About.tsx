const About = () => {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl text-center space-y-4">
        <h1 className="text-4xl font-bold border-b-2 border-white pb-2">About Us</h1>
        <p className="text-lg leading-relaxed">
          Welcome to our 10-minute grocery delivery app! We are dedicated to bringing fresh groceries to your door in no time. Our goal is to save you time and provide a convenient and seamless shopping experience.
        </p>
        <p className="text-lg leading-relaxed">
          We value our customers and are committed to offering high-quality products, fast service, and excellent customer support. Whether you are restocking your pantry or shopping for fresh produce, we have got you covered!
        </p>
      </div>
    </div>
  );
};

export default About;
