import { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { Search, Filter, Loader2 } from 'lucide-react';

const categories = ['All', 'Trending', 'Flash Deals', 'Vegetables', 'Fruits', 'Dairy', 'Bakery', 'Beverages', 'Snacks', 'Pantry'];

const Home = () => {
    const [products, setProducts] = useState([]);
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [discountedProducts, setDiscountedProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                setProducts(data);
                setFilteredProducts(data);

                // Set trending and discounted based on explicit flags
                setTrendingProducts(data.filter(p => p.isTrending).slice(0, 10));
                setDiscountedProducts(data.filter(p => p.isFlashDeal).slice(0, 10));
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        let results = products;

        if (activeCategory === 'Trending') {
            results = results.filter((p) => p.isTrending);
        } else if (activeCategory === 'Flash Deals') {
            results = results.filter((p) => p.isFlashDeal);
        } else if (activeCategory !== 'All') {
            results = results.filter((p) => p.category === activeCategory);
        }

        if (search) {
            results = results.filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.category.toLowerCase().includes(search.toLowerCase())
            );
        }
        setFilteredProducts(results);
    }, [search, activeCategory, products]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-primary-500 mb-2" size={32} />
                <p className="text-gray-500 font-medium">Loading fresh items...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-10">
            {/* Search Input */}
            <div className="relative group sticky top-0 z-10 bg-white/80 backdrop-blur-md pt-2 pb-1">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none mt-1">
                    <Search size={18} className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="Search items, groceries..."
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary-100 transition-all border-none shadow-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {!search && activeCategory === 'All' && (
                <>
                    {/* Trending Section */}
                    {trendingProducts.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-1">
                                <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                                    <span className="bg-amber-400 w-2 h-8 rounded-full"></span>
                                    Most Trending
                                </h3>
                                <button
                                    onClick={() => {
                                        setActiveCategory('Trending');
                                        window.scrollTo({ top: document.getElementById('catalog').offsetTop - 100, behavior: 'smooth' });
                                    }}
                                    className="text-xs font-bold text-primary-500 uppercase tracking-widest px-3 py-1 bg-primary-50 rounded-full hover:bg-primary-100 transition-colors"
                                >
                                    Explore
                                </button>
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
                                {trendingProducts.map((p) => (
                                    <div key={p._id} className="min-w-[160px] w-[160px]">
                                        <ProductCard product={p} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Discounted/Flash Deals Section */}
                    {discountedProducts.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-1">
                                <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                                    <span className="bg-green-500 w-2 h-8 rounded-full"></span>
                                    Flash Deals
                                </h3>
                                <button
                                    onClick={() => {
                                        setActiveCategory('Flash Deals');
                                        window.scrollTo({ top: document.getElementById('catalog').offsetTop - 100, behavior: 'smooth' });
                                    }}
                                    className="text-xs font-bold text-primary-500 uppercase tracking-widest px-3 py-1 bg-primary-50 rounded-full hover:bg-primary-100 transition-colors"
                                >
                                    View All
                                </button>
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
                                {discountedProducts.map((p) => (
                                    <div key={p._id} className="min-w-[160px] w-[160px]">
                                        <ProductCard product={p} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Main Catalog */}
            <div id="catalog" className="space-y-6">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center px-1">
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">
                            {search ? 'Search Results' : activeCategory === 'All' ? 'Our Catalog' : `${activeCategory}`}
                        </h3>
                    </div>

                    {/* Category Horizontal Chips */}
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2.5 rounded-2xl whitespace-nowrap text-xs font-black uppercase tracking-widest transition-all ${activeCategory === cat
                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-200'
                                    : 'bg-white text-gray-500 border border-gray-100 hover:bg-primary-50 active:scale-95'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((p) => (
                            <ProductCard key={p._id} product={p} />
                        ))
                    ) : (
                        <div className="col-span-2 text-center py-12">
                            <div className="bg-slate-50 rounded-3xl p-10 inline-block">
                                <p className="text-slate-400 font-bold">No products found for this selection.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
