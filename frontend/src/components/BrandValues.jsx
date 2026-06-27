import React, { useEffect, useState } from 'react';

const VALUES = [
  {
    id: 'sartorial',
    title: 'Sartorial Heritage',
    desc: 'Decades of tradition forged across Europe\'s historic design capitals, delivering prestige you can feel in every component.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    )
  },
  {
    id: 'ethical',
    title: 'Ethical Sourcing',
    desc: 'We preserve ecosystems. Every ounce of gold, calfskin, and rare botanic essence is certified ethical and fully traceable.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h12l4 6-10 13L2 9z"></path>
        <path d="M11 3 8 9l4 13 4-13-3-6"></path>
        <path d="M2 9h20"></path>
      </svg>
    )
  },
  {
    id: 'craft',
    title: 'Unrivaled Precision',
    desc: 'From microns-thick gear alignments to hand-stitched seams, precision is our absolute measure of luxurious durability.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9.2 12 2.8 8 2.8-8"></path>
        <circle cx="12" cy="8" r="2"></circle>
        <path d="m13.8 11.2 6.7 9.8"></path>
        <path d="m10.2 11.2-6.7 9.8"></path>
        <path d="M21 21H3"></path>
      </svg>
    )
  },
  {
    id: 'bespoke',
    title: 'Bespoke Excellence',
    desc: 'We adapt to you. Commission individual colorways, dial engravings, and premium leather finishes via our concierge.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="11" r="5"></circle>
        <path d="m11 11 1.25-1.25"></path>
        <path d="m21 16 1.25-1.25"></path>
        <path d="M10.5 7.5h8.5v3h-3v3h-3v-3h-2.5"></path>
        <path d="M21 21v-5h-3v3h-2v2h5Z"></path>
      </svg>
    )
  }
];

export default function BrandValues() {
  const [visibleCards, setVisibleCards] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-id');
            setVisibleCards((prev) => ({ ...prev, [id]: true }));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const elements = document.querySelectorAll('.value-card-el');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="values" className="px-[5%] py-[120px] relative">
      <div className="text-center mb-20">
        <span className="text-[0.75rem] text-amber-400 tracking-[0.35em] uppercase mb-3 block">
          MAISON ESSENCE
        </span>
        <h2 className="text-[2rem] md:text-[3rem] font-serif font-light tracking-[0.1em] text-white">
          THE <span className="font-semibold">PILLARS OF EXCELLENCE</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[30px] max-w-[1200px] mx-auto">
        {VALUES.map((val) => {
          const isVisible = visibleCards[val.id];
          return (
            <div
              key={val.id}
              data-id={val.id}
              className={`value-card-el p-10 bg-gradient-to-br from-white/2 to-white/[0.005] border border-white/5 rounded-2xl text-center duration-700 transition-all hover:translate-y-[-8px] hover:border-amber-500/35 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(255,255,255,0.02)] group ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[40px]'
              }`}
            >
              <div className="w-[70px] h-[70px] rounded-full border border-amber-500/50 bg-amber-400/[0.03] flex justify-center items-center mx-auto mb-6 text-amber-400 shadow-md shadow-black/20 group-hover:border-amber-300 group-hover:text-amber-200 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] group-hover:scale-105 duration-500 transition-all relative overflow-hidden">
                <div className="group-hover:rotate-y-180 duration-1000 transition-transform">
                  {val.icon}
                </div>
              </div>
              <h3 className="text-[1rem] text-white font-serif mb-[15px]">{val.title}</h3>
              <p className="text-[0.8rem] font-light leading-relaxed text-zinc-400">
                {val.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
