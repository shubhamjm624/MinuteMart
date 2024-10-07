const SearchBar = () => {
    return (
      <div className="bg-white shadow-md rounded-lg p-4 mb-8">
        <input
          type="text"
          placeholder="Search for products (e.g., milk, carrot, meat...)"
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>
    );
  };
  
  export default SearchBar;
  