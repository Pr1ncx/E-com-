import React, { useEffect, useRef, useState } from 'react';

const CHAPTERS = [
  {
    id: 'swiss',
    number: 'CHAPTER I',
    title: 'Precision Horology',
    text: 'In our Jura Valley atelier in Switzerland, time is treated not as a metric, but as an art form. Every gear, dial, and rose gold chassis of our Chrono-Elite timepiece is hand-polished and assembled by secondary-generation horologists, combining historic lever movements with modern precision.',
    bullets: [
      'Swiss-certified mechanical automatic movement',
      'Hand-finished solid 18k rose gold chassis'
    ],
    image: 'assets/watch.png',
    badge: 'JURA VALLEY, CH'
  },
  {
    id: 'france',
    number: 'CHAPTER II',
    title: 'The Art of Scent',
    text: 'Grasse, France serves as the olfactory crucible for L\'Élixir N°5. Petals harvested at dawn, rare amber crystals extracted ethically from deep mountains, and aged Madagascar vanilla pods are blended in absolute dark barrels. Encased in hand-blown crystal glass, this perfume represents pure liquid elegance.',
    bullets: [
      'Olfactory design by master perfumer',
      'Hand-blown crystal bottle numbered individually'
    ],
    image: 'assets/perfume.png',
    badge: 'GRASSE, FR'
  },
  {
    id: 'italy',
    number: 'CHAPTER III',
    title: 'Sartorial Leathercraft',
    text: 'In Florence, Italy, leathercraft reaches its absolute zenith. Hand-selected calfskin hides undergo organic vegetable tanning before being stitched with heavy-gauge silk thread. The hardware details on our bags are machined from raw brass and double-plated with 24k gold, ensuring timeless beauty.',
    bullets: [
      'Artisanal vegetable-tanned French leather',
      'Solid brass hardware plated in 24k gold'
    ],
    image: 'assets/handbag.png',
    badge: 'FLORENCE, IT'
  }
];

export default function Storytelling() {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibleChapters, setVisibleChapters] = useState({});

  useEffect(() => {
    // Scroll progress line calculation
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = rect.height;
      const containerTop = rect.top + window.scrollY;
      const screenHeight = window.innerHeight;
      
      const startScroll = containerTop - screenHeight / 2;
      const endScroll = containerTop + containerHeight - screenHeight / 2;
      const currentScroll = window.scrollY;
      
      let percentage = ((currentScroll - startScroll) / (endScroll - startScroll)) * 100;
      percentage = Math.max(0, Math.min(percentage, 100));
      setScrollProgress(percentage);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Intersection observer for animating entries
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-id');
            setVisibleChapters((prev) => ({ ...prev, [id]: true }));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const elements = document.querySelectorAll('.story-chapter-el');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Glare mouse movement handler
  const handleMouseMove = (e, id) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <section id="story" className="px-[5%] py-[120px] relative">
      <div className="text-center mb-20">
        <span className="text-[0.75rem] text-amber-400 tracking-[0.35em] uppercase mb-3 block">
          CHRONICLES OF CRAFT
        </span>
        <h2 className="text-[2rem] md:text-[3rem] font-serif font-light tracking-[0.1em] text-white">
          THE <span className="font-semibold">MAISON HERITAGE</span>
        </h2>
      </div>

      <div ref={containerRef} className="max-w-[1200px] mx-auto relative">
        {/* Timeline bar */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/5 -translate-x-1/2 hidden md:block"></div>
        <div
          className="absolute left-1/2 top-0 w-[1px] bg-gradient-to-b from-amber-200 to-amber-500 -translate-x-1/2 shadow-[0_0_10px_rgba(212,175,55,0.4)] hidden md:block"
          style={{ height: `${scrollProgress}%` }}
        ></div>

        {/* Chapters */}
        <div className="flex flex-col gap-28 md:gap-36">
          {CHAPTERS.map((chapter, idx) => {
            const isVisible = visibleChapters[chapter.id];
            const isEven = idx % 2 === 1;

            return (
              <div
                key={chapter.id}
                data-id={chapter.id}
                className={`story-chapter-el flex flex-col md:flex-row items-center relative transition-all duration-1000 ${
                  isEven ? 'md:flex-row-reverse' : ''
                } ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
              >
                {/* Text Content */}
                <div className="w-full md:w-[45%] px-0 md:px-10 mb-8 md:mb-0">
                  <span className="font-serif text-[1rem] text-amber-400 mb-[15px] block">
                    {chapter.number}
                  </span>
                  <h3 className="text-[1.8rem] text-white mb-5 font-serif">{chapter.title}</h3>
                  <p className="text-[0.95rem] font-light leading-relaxed text-zinc-400 mb-6">
                    {chapter.text}
                  </p>
                  <ul className="list-none flex flex-col gap-3">
                    {chapter.bullets.map((bullet, bidx) => (
                      <li key={bidx} className="flex items-center gap-3 text-[0.85rem] text-zinc-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-amber-400 flex-shrink-0"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Vertical node indicator on timeline */}
                <div
                  className={`absolute left-1/2 top-[50px] -translate-x-1/2 w-3 h-3 rounded-full border-2 transition-all duration-700 hidden md:block ${
                    scrollProgress > (idx / CHAPTERS.length) * 100 + 10
                      ? 'bg-amber-400 border-amber-300 shadow-[0_0_12px_rgba(212,175,55,0.6)]'
                      : 'bg-zinc-950 border-white/10'
                  }`}
                ></div>

                {/* Visual Image */}
                <div className="w-full md:w-[45%] px-0 md:px-10 flex justify-center">
                  <div
                    onMouseMove={(e) => handleMouseMove(e, chapter.id)}
                    className="relative w-full max-w-[450px] aspect-[4/5] rounded-2xl overflow-hidden border border-white/5 shadow-2xl cursor-pointer group"
                    style={{
                      '--mouse-x': '0px',
                      '--mouse-y': '0px'
                    }}
                  >
                    {/* Dark gradient base mask */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/85 z-10 pointer-events-none"></div>
                    
                    {/* Moving reflection overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(255,255,255,0.08)_0%,transparent_60%)] z-20 pointer-events-none transition-transform duration-200"></div>

                    <img
                      src={chapter.image}
                      alt={chapter.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <span className="absolute bottom-6 left-6 px-4 py-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-full font-serif text-[0.65rem] tracking-[0.2em] text-white z-20 shadow-lg shadow-black/40">
                      {chapter.badge}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
