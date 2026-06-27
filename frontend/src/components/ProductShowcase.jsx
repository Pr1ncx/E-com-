import React, { useEffect, useState } from 'react';
import { useBag } from '../context/BagContext';

const FALLBACK_PRODUCTS = [
  {
    id: 'aurelia-chrono',
    serial: 'AURELIA // CHRONO-ELITE',
    availability: 'Limited / 50 Pieces',
    title: 'Chrono-Elite Rose Gold',
    price: '$12,450',
    priceVal: 12450,
    desc: 'Handcrafted mechanical timepiece featuring custom automatic movement, 18k solid rose gold casing, sapphire crystal face, and bespoke alligator leather strap. Precision-calibrated in Geneva.',
    image: 'assets/watch.png',
    category: 'timepieces',
    glowColor: 'radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, transparent 70%)'
  },
  {
    id: 'aurelia-perfume',
    serial: 'AURELIA // L\'ÉLIXIR N°5',
    availability: 'Exclusive / 100 Bottles',
    title: 'L\'Élixir Fragrance N°5',
    price: '$680',
    priceVal: 680,
    desc: 'A sensual fusion of rare dark amber, midnight jasmine, tobacco leaf, and smoky vanilla. Encased in a hand-blown obsidian crystal bottle with custom 24k gold leaf lettering.',
    image: 'assets/perfume.png',
    category: 'fragrances',
    glowColor: 'radial-gradient(circle, rgba(146, 64, 14, 0.25) 0%, transparent 70%)'
  },
  {
    id: 'aurelia-handbag',
    serial: 'AURELIA // LA MATIÈRE',
    availability: 'Atelier / Made-to-Order',
    title: 'Signature Leather Bag',
    price: '$3,200',
    priceVal: 3200,
    desc: 'Exquisite full-grain French calfskin handbag hand-stitched by senior master artisans. Finished with premium gold-plated brass lock mechanism and plush velvet interior lining.',
    image: 'assets/handbag.png',
    category: 'accessories',
    glowColor: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)'
  },
  {
    id: 'aurelia-glasses',
    serial: 'AURELIA // LUMINA',
    availability: 'Bespoke / 20 Units',
    title: 'Aura Lumina Glasses',
    price: '$1,850',
    priceVal: 1850,
    desc: 'Smart-eyewear marrying Italian hand-polished acetate frame with German Carl Zeiss gradient lenses, embedded head-up AR guidance, and luxury haptic controls.',
    image: 'assets/glasses.png',
    category: 'optics',
    glowColor: 'radial-gradient(circle, rgba(30, 58, 138, 0.2) 0%, transparent 70%)'
  }
];

export default function ProductShowcase({ onOpenAllocation }) {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addToBag, setIsBagOpen } = useBag();

  useEffect(() => {
    // Fetch products from full-stack Node backend
    fetch('http://localhost:5000/api/products')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          // Map backend products and add glowColor variables
          const mapped = res.data.map((prod) => {
            let glowColor = 'radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, transparent 70%)';
            if (prod.id === 'aurelia-perfume') {
              glowColor = 'radial-gradient(circle, rgba(146, 64, 14, 0.25) 0%, transparent 70%)';
            } else if (prod.id === 'aurelia-handbag') {
              glowColor = 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)';
            } else if (prod.id === 'aurelia-glasses') {
              glowColor = 'radial-gradient(circle, rgba(30, 58, 138, 0.2) 0%, transparent 70%)';
            }
            return { ...prod, glowColor };
          });
          setProducts(mapped);
        }
      })
      .catch((err) => {
        console.warn('Backend API connection failed, using offline fallback selections.', err);
      });
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  // Touch handlers for mobile swiping
  let touchStartX = 0;
  const handleTouchStart = (e) => {
    touchStartX = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const threshold = 50;
    if (touchStartX - touchEndX > threshold) {
      handleNext();
    } else if (touchEndX - touchStartX > threshold) {
      handlePrev();
    }
  };

  const handleAddToCabinet = (product) => {
    addToBag(product);
    setIsBagOpen(true);
  };

  const activeProduct = products[currentIndex];
  const progressPercent = ((currentIndex + 1) / products.length) * 100;

  return (
    <section id="showcase" className="px-[5%] py-[120px] relative">
      <div className="text-center mb-20">
        <span className="text-[0.75rem] text-amber-400 tracking-[0.35em] uppercase mb-3 block">
          CURATED SELECTIONS
        </span>
        <h2 className="text-[2rem] md:text-[3rem] font-serif font-light tracking-[0.1em] text-white">
          THE <span className="font-semibold">PRODUCT ATELIER</span>
        </h2>
      </div>

      <div className="max-w-[1400px] mx-auto overflow-visible py-5">
        {/* Carousel Slider */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="flex flex-col md:flex-row items-center justify-center min-h-[520px] gap-8"
        >
          {products.map((product, idx) => {
            const isActive = idx === currentIndex;
            
            // In mobile we only show active card, on desktop we show all but active card glows/scales
            return (
              <div
                key={product.id}
                className={`showcase-card flex flex-col justify-between p-8 rounded-2xl border bg-gradient-to-br from-white/3 to-white/1 shadow-2xl overflow-hidden cursor-pointer duration-700 transition-all ${
                  isActive
                    ? 'scale-[1.03] translate-y-[-5px] border-amber-500/50 shadow-[0_30px_70px_rgba(0,0,0,0.7),0_0_40px_rgba(212,175,55,0.08)] z-10'
                    : 'hidden md:flex opacity-30 scale-[0.95] border-white/5 filter blur-[1px]'
                } w-full md:w-[380px] h-[500px] relative group`}
              >
                {/* Glow border ring effect */}
                <span className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-white/5 via-transparent to-amber-500/10 group-hover:from-white/15 group-hover:to-amber-500/35 transition-all duration-500 pointer-events-none"></span>

                <div className="flex justify-between items-start z-10">
                  <span className="text-[0.65rem] tracking-[0.2em] text-zinc-500 font-sans uppercase">
                    {product.serial}
                  </span>
                  <span className="text-[0.6rem] tracking-[0.15em] text-amber-400 uppercase border border-amber-400/20 px-[10px] py-[4px] rounded-full bg-amber-400/5">
                    {product.availability}
                  </span>
                </div>

                <div className="h-[220px] w-full flex items-center justify-center relative z-0">
                  <div
                    className="absolute w-[180px] h-[180px] rounded-full filter blur-[25px] opacity-15 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500"
                    style={{ background: product.glowColor }}
                  ></div>
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-[180px] h-[180px] object-cover rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.6)] border-2 border-white/5 transition-transform duration-700 group-hover:rotate-3 group-hover:scale-108"
                  />
                </div>

                <div className="z-10 mt-[15px]">
                  <h3 className="text-[1.3rem] text-white font-serif mb-1">{product.title}</h3>
                  <span className="text-[1.15rem] text-amber-200 font-serif font-medium mb-3 block">
                    {product.price}
                  </span>
                  <p className="text-[0.8rem] font-light text-zinc-400 leading-relaxed h-[48px] overflow-hidden line-clamp-3">
                    {product.desc}
                  </p>
                </div>

                <div className="z-10 flex gap-4 mt-5">
                  <button
                    onClick={() => onOpenAllocation(product)}
                    className="flex-1 py-3 text-[0.65rem] font-semibold tracking-[0.2em] uppercase rounded bg-amber-400 border border-amber-400 text-black shadow-lg shadow-amber-400/10 hover:bg-white hover:border-white hover:shadow-white/10 transition-all duration-300"
                  >
                    Acquire
                  </button>
                  <button
                    onClick={() => handleAddToCabinet(product)}
                    className="flex-1 py-3 text-[0.65rem] font-semibold tracking-[0.2em] uppercase rounded bg-transparent border border-white/10 text-white hover:bg-white/5 hover:border-white/30 transition-all duration-300"
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel controls */}
        <div className="flex justify-center items-center gap-[30px] mt-12">
          <button
            onClick={handlePrev}
            className="w-[50px] h-[50px] rounded-full border border-white/5 bg-white/2 backdrop-blur-md flex justify-center items-center text-zinc-400 hover:border-amber-400 hover:text-amber-400 hover:scale-[1.08] hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all duration-300"
            aria-label="Previous Slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>

          <div className="w-[200px] h-[2px] bg-white/5 rounded-full relative overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-amber-400 rounded-full shadow-[0_0_8px_rgba(212,175,55,0.5)] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <button
            onClick={handleNext}
            className="w-[50px] h-[50px] rounded-full border border-white/5 bg-white/2 backdrop-blur-md flex justify-center items-center text-zinc-400 hover:border-amber-400 hover:text-amber-400 hover:scale-[1.08] hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all duration-300"
            aria-label="Next Slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
