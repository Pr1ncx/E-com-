import React from 'react';
import { useBag } from '../context/BagContext';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'Accessories', 'Scent', 'Optics', 'Tech', 'Home', 'Apparel'];

export default function Header({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }) {
  const { getItemsCount, setIsBagOpen } = useBag();
  const { currentUser, logoutUser, setIsAuthModalOpen } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-zinc-200 shadow-sm transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className="bg-zinc-950 text-white text-center py-2 px-4 text-[0.7rem] font-medium tracking-wider">
        SUMMER SALE: USE COUPON <span className="text-amber-400 font-semibold">SUMMER10</span> FOR 10% OFF | FREE SHIPPING ON ORDERS OVER ₹1,500
      </div>

      <nav className="max-w-[1300px] mx-auto px-4 md:px-8 h-[75px] flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <a
          href="#"
          onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
          className="text-lg md:text-xl font-bold tracking-wider text-zinc-950 flex-shrink-0 flex items-center gap-2"
        >
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
          AURA<span className="text-indigo-600">STORE</span>
        </a>

        {/* Search Bar Input */}
        <div className="flex-1 max-w-[450px] relative hidden sm:block">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
            placeholder="Search our catalog..."
          />
          <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

        {/* Actions, User Auth & Cart */}
        <div className="flex items-center gap-2 sm:gap-4">
          {currentUser ? (
            <div className="flex items-center gap-2 border-r border-zinc-200 pr-3 sm:pr-4">
              <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 flex justify-center items-center text-xs font-bold text-indigo-700">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden lg:block text-left text-xs">
                <p className="font-bold text-zinc-800 line-clamp-1">{currentUser.name}</p>
                <button
                  onClick={logoutUser}
                  className="text-zinc-400 hover:text-indigo-600 font-semibold"
                >
                  Sign Out
                </button>
              </div>
              <button
                onClick={logoutUser}
                className="lg:hidden text-xs text-zinc-400 hover:text-indigo-600 font-bold px-2 py-1"
                aria-label="Logout"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="text-xs sm:text-sm font-semibold text-zinc-700 hover:text-indigo-600 px-3 py-2 transition-all border border-transparent hover:border-zinc-200 rounded-lg flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Sign In
            </button>
          )}

          <button
            onClick={() => setIsBagOpen(true)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-50 border border-transparent hover:border-zinc-200 rounded-lg text-zinc-700 transition-all relative"
            aria-label="Cart"
          >
            <div className="relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              {getItemsCount() > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[0.65rem] font-bold w-4 h-4 rounded-full flex justify-center items-center">
                  {getItemsCount()}
                </span>
              )}
            </div>
            <span className="text-sm font-medium hidden md:inline">Cart</span>
          </button>
        </div>
      </nav>

      {/* Category Navigation Bar */}
      <div className="border-t border-zinc-100 bg-zinc-50/50 overflow-x-auto">
        <div className="max-w-[1300px] mx-auto px-4 md:px-8 flex items-center gap-2 py-2.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs md:text-sm font-medium px-4 py-1.5 rounded-full transition-all flex-shrink-0 ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-600 hover:text-indigo-600 hover:bg-zinc-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
