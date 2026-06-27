import React from 'react';

export default function Hero({ setSelectedCategory }) {
  return (
    <section className="bg-zinc-50 border-b border-zinc-200 py-12 md:py-20 px-4 md:px-8">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Call to action */}
        <div className="text-left space-y-6">
          <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 px-3.5 py-1.5 rounded-full">
            SEASON EXCLUSIVE
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-zinc-900 tracking-tight leading-tight">
            Minimalist Design.<br />
            <span className="text-indigo-600">Everyday Comfort.</span>
          </h1>
          <p className="text-zinc-600 text-sm md:text-base leading-relaxed max-w-[500px]">
            Explore our curated catalog of essential accessories, scents, apparel, and optics. Hand-selected for exceptional quality, modern design, and functional longevity.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setSelectedCategory('Accessories')}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-indigo-700 transition-all"
            >
              Shop Accessories
            </button>
            <button
              onClick={() => setSelectedCategory('Tech')}
              className="px-6 py-3 bg-white text-zinc-800 border border-zinc-200 font-semibold text-sm rounded-lg hover:bg-zinc-50 hover:border-zinc-300 transition-all"
            >
              Explore Tech
            </button>
          </div>
        </div>

        {/* Promo Showcase card */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[16/10] bg-zinc-200">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80"
            alt="Storefront collection banner"
            className="w-full h-full object-cover hover:scale-105 duration-700 transition-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 md:p-8">
            <span className="text-[0.7rem] font-bold text-amber-400 uppercase tracking-widest mb-2">PROMOTION ACTIVE</span>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Use code SUMMER10</h3>
            <p className="text-zinc-200 text-xs md:text-sm font-light">Get 10% off your entire selection and free global shipping on orders over ₹1,500.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
