import React, { useEffect, useState } from 'react';
import { useBag } from '../context/BagContext';

const FALLBACK_PRODUCTS = [
  {
    id: 'aurelia-chrono',
    title: 'Aurum Chronograph Watch',
    price: '₹4,999.00',
    priceVal: 4999,
    category: 'Accessories',
    image: 'assets/watch.png',
    rating: 4.8,
    reviews: 142,
    desc: 'Contemporary minimalist watch featuring Japanese quartz movement, stainless steel case, and genuine grain-leather strap.'
  },
  {
    id: 'aurelia-perfume',
    title: 'Obsidian Fragrance N°5',
    price: '₹1,899.00',
    priceVal: 1899,
    category: 'Scent',
    image: 'assets/perfume.png',
    rating: 4.7,
    reviews: 84,
    desc: 'Unisex signature perfume combining dark amber, warm vanilla, and subtle notes of patchouli and musk.'
  },
  {
    id: 'aurelia-handbag',
    title: 'Classic Leather Tote Bag',
    price: '₹3,499.00',
    priceVal: 3499,
    category: 'Accessories',
    image: 'assets/handbag.png',
    rating: 4.9,
    reviews: 196,
    desc: 'Everyday carrying tote hand-stitched with durable oiled full-grain leather, solid copper rivets, and internal zippered pouch.'
  },
  {
    id: 'aurelia-glasses',
    title: 'Horizon Aviator Sunglasses',
    price: '₹1,299.00',
    priceVal: 1299,
    category: 'Optics',
    image: 'assets/glasses.png',
    rating: 4.6,
    reviews: 73,
    desc: 'Polarized gradient lenses encased in a sturdy tortoiseshell acetate frame, providing absolute UV400 shield.'
  }
];

export default function ProductCatalog({ searchQuery, selectedCategory, onOpenQuickView }) {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [sortBy, setSortBy] = useState('featured'); // featured | price-low-high | price-high-low | rating
  const { addToBag, setIsBagOpen } = useBag();

  useEffect(() => {
    // Fetch products catalog from Node/Express API
    fetch('http://localhost:5000/api/products')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setProducts(res.data);
        }
      })
      .catch((err) => {
        console.warn('Backend API connection failed, using local product catalog fallback.', err);
      });
  }, []);

  const handleQuickAdd = (product, e) => {
    e.stopPropagation();
    addToBag(product, 1);
    setIsBagOpen(true);
  };

  // Filter & Sort logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory =
      selectedCategory === 'All' ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low-high') {
      return a.priceVal - b.priceVal;
    } else if (sortBy === 'price-high-low') {
      return b.priceVal - a.priceVal;
    } else if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return 0; // featured
  });

  return (
    <section id="showcase" className="max-w-[1300px] mx-auto px-4 md:px-8 py-12">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 pb-5 mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-zinc-900">
            {selectedCategory === 'All' ? 'Our Collections' : selectedCategory}
          </h2>
          <p className="text-xs md:text-sm text-zinc-500 mt-1">
            Showing {sortedProducts.length} {sortedProducts.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <label htmlFor="sort" className="text-xs font-semibold text-zinc-600 uppercase flex-shrink-0">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 sm:flex-initial text-xs border border-zinc-200 rounded-lg px-3 py-2 text-zinc-800 bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
          >
            <option value="featured">Featured</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Grid List */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-20 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
          <svg className="w-12 h-12 text-zinc-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 className="text-lg font-bold text-zinc-800 mb-1">No items found</h3>
          <p className="text-zinc-500 text-sm">We couldn't find matches matching "{searchQuery}" or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onOpenQuickView(product)}
              className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-zinc-300 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              {/* Product Image Panel */}
              <div className="aspect-square w-full bg-zinc-50 border-b border-zinc-100 relative overflow-hidden flex items-center justify-center p-6">
                <img
                  src={product.image}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain rounded-lg group-hover:scale-106 duration-500 transition-transform"
                />
                <button
                  onClick={(e) => handleQuickAdd(product, e)}
                  className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white border border-zinc-200 text-zinc-800 shadow-md flex justify-center items-center hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:scale-108 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                  title="Add to Cart"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </button>
                <span className="absolute top-3 left-3 bg-zinc-950 text-white text-[0.6rem] font-bold tracking-widest px-2.5 py-1 rounded uppercase">
                  {product.category}
                </span>
              </div>

              {/* Product Info Panel */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Rating star review log */}
                  <div className="flex items-center gap-1 mb-2">
                    <svg className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <span className="text-[0.7rem] font-bold text-zinc-700">{product.rating}</span>
                    <span className="text-[0.65rem] text-zinc-400">({product.reviews})</span>
                  </div>

                  <h3 className="text-zinc-900 font-bold text-sm leading-snug group-hover:text-indigo-600 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-zinc-500 text-xs mt-1.5 line-clamp-2 font-light">
                    {product.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-100">
                  <span className="text-zinc-900 font-extrabold text-sm">{product.price}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onOpenQuickView(product); }}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wider"
                  >
                    Quick View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
