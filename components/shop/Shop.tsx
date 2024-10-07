import SearchBar from '@/components/shop/SearchBar';
import AvailableProducts from '@/components/shop/AvailableProducts';

const Shop = () => {
  return (
    <div className="bg-white min-h-screen p-4 md:p-8">
      <h1 className="text-3xl font-bold text-center text-black mb-6">Shop</h1>
      <SearchBar />
      <AvailableProducts />
    </div>
  );
};

export default Shop;
