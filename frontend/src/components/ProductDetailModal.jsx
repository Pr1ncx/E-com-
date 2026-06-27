import React, { useState } from 'react';
import { useBag } from '../context/BagContext';

export default function ProductDetailModal({ product, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const { addToBag, setIsBagOpen } = useBag();

  if (!product) return null;

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < (product.stock || 10)) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    addToBag(product, quantity);
    setIsBagOpen(true);
    onClose();
  };

  const isOutOfStock = product.stock !== undefined && product.stock <= 0;
  const isLowStock = product.stock !== undefined && product.stock > 0 && product.stock <= 5;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-50 flex justify-center items-center p-4">
      {/* Backdrop click closer */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="bg-white border border-zinc-200 shadow-2xl rounded-2xl w-full max-w-[800px] overflow-hidden relative z-10 flex flex-col md:flex-row transform transition-all duration-300 max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 hover:rotate-90 duration-300 transition-all p-1.5 bg-zinc-50 border border-zinc-200 rounded-full z-20"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        {/* Product Image Panel (Left) */}
        <div className="w-full md:w-1/2 bg-zinc-50 flex items-center justify-center p-8 relative border-b md:border-b-0 md:border-r border-zinc-100">
          <img
            src={product.image}
            alt={product.title}
            className="max-h-[300px] max-w-full object-contain rounded-lg shadow-sm"
          />
          <span className="absolute top-4 left-4 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full uppercase">
            {product.category}
          </span>
        </div>

        {/* Product Info Panel (Right) */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">
              CATALOG PRODUCT
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-zinc-950 leading-tight">
              {product.title}
            </h2>

            {/* Rating reviews stars */}
            <div className="flex items-center gap-1.5 pb-2 border-b border-zinc-100">
              <svg className="w-5 h-5 text-amber-400 fill-amber-400" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span className="text-sm font-bold text-zinc-800">{product.rating}</span>
              <span className="text-xs text-zinc-400">({product.reviews} customer reviews)</span>
            </div>

            <div className="text-2xl font-extrabold text-zinc-900">
              {product.price}
            </div>

            <p className="text-zinc-600 text-sm leading-relaxed font-light">
              {product.desc}
            </p>

            {/* Inventory Status indicator */}
            <div className="flex items-center gap-2 text-xs">
              {isOutOfStock ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  <span className="text-red-600 font-bold">Out of Stock — Temp unavailable</span>
                </>
              ) : isLowStock ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span className="text-amber-700 font-bold">Hurry! Only {product.stock} items left in stock</span>
                </>
              ) : (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-emerald-700 font-semibold">In Stock — {product.stock || 10} units ready to ship</span>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4 mt-6 md:mt-8 pt-6 border-t border-zinc-100">
            {/* Quantity Controller */}
            {!isOutOfStock && (
              <div>
                <label htmlFor="qty-select" className="text-xs font-bold text-zinc-600 uppercase mb-2 block">
                  Quantity
                </label>
                <div className="inline-flex items-center border border-zinc-200 rounded-lg overflow-hidden h-[45px]">
                  <button
                    onClick={handleDecrease}
                    className="w-12 h-full bg-zinc-50 hover:bg-zinc-100 border-r border-zinc-200 text-zinc-600 flex justify-center items-center transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                    </svg>
                  </button>
                  <span className="px-6 text-sm font-semibold text-zinc-800">{quantity}</span>
                  <button
                    onClick={handleIncrease}
                    className="w-12 h-full bg-zinc-50 hover:bg-zinc-100 border-l border-zinc-200 text-zinc-600 flex justify-center items-center transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-3.5 text-white font-bold text-sm tracking-wider uppercase rounded-xl shadow-md hover:shadow-lg transition-all flex justify-center items-center ${
                isOutOfStock
                  ? 'bg-zinc-300 cursor-not-allowed shadow-none'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
