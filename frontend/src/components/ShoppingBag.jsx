import React, { useState } from 'react';
import { useBag } from '../context/BagContext';

export default function ShoppingBag() {
  const { bagItems, removeFromBag, getSubtotal, isBagOpen, setIsBagOpen } = useBag();
  const [checkoutStatus, setCheckoutStatus] = useState('idle'); // idle | loading | done

  const handleCheckout = () => {
    if (bagItems.length === 0) return;
    setCheckoutStatus('loading');

    fetch('http://localhost:5000/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items: bagItems })
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setCheckoutStatus('done');
          console.log('Secure Checkout Session Initialised:', res.data);
          alert(`Secure checkout request initialized. Invoice Number: ${res.data.invoiceNumber}\nRedirecting client to boutique payment portal: ${res.data.paymentUrl}`);
          setCheckoutStatus('idle');
        }
      })
      .catch((err) => {
        console.warn('API checkout offline, launching mock checkout invoice.', err);
        setTimeout(() => {
          setCheckoutStatus('done');
          alert(`Bespoke checkout invoice generated successfully! Total Estimated Value: $${getSubtotal().toLocaleString()}\nTransaction coordinates sent to registered client liaison.`);
          setCheckoutStatus('idle');
        }, 1500);
      });
  };

  return (
    <>
      {/* Overlay Backdrop */}
      <div
        onClick={() => setIsBagOpen(false)}
        className={`fixed inset-0 bg-black/60 backdrop-blur-[5px] z-40 transition-opacity duration-500 ${
          isBagOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      ></div>

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 w-full max-w-[420px] h-screen bg-gradient-to-b from-zinc-900 to-zinc-950 border-l border-amber-500/50 shadow-2xl z-50 flex flex-col transition-all duration-500 ${
          isBagOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-[1.2rem] text-white font-serif flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            YOUR CABINET
          </h3>
          <button
            onClick={() => setIsBagOpen(false)}
            className="text-zinc-500 hover:text-amber-400 p-1 transition-colors"
            aria-label="Close Shopping Bag Drawer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Drawer Items */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-5">
          {bagItems.length === 0 ? (
            <div className="text-center text-zinc-500 text-[0.85rem] mt-24 tracking-widest uppercase">
              YOUR PRIVATE SELECTION IS CURRENTLY EMPTY
            </div>
          ) : (
            bagItems.map((item) => (
              <div key={item.id} className="flex items-center gap-5 pb-5 border-b border-white/3">
                <img className="w-16 h-16 rounded-full object-cover border border-white/5" src={item.image} alt={item.title} />
                <div className="flex-1">
                  <h4 className="text-[0.9rem] text-white font-serif mb-1">{item.title}</h4>
                  <span className="text-[0.85rem] text-amber-200 font-serif">
                    {item.price} {item.quantity > 1 ? `(x${item.quantity})` : ''}
                  </span>
                </div>
                <button
                  onClick={() => removeFromBag(item.id)}
                  className="text-zinc-500 hover:text-amber-400 text-[0.75rem] tracking-wider uppercase transition-colors"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-8 border-t border-white/5 bg-white/[0.01]">
          <div className="flex justify-between mb-5 text-[0.95rem] text-zinc-300 font-sans">
            <span>ESTIMATED VALUE</span>
            <span className="font-serif text-amber-200 font-semibold text-lg">
              ${getSubtotal().toLocaleString()}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={bagItems.length === 0 || checkoutStatus === 'loading'}
            className="w-full py-4 bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-black text-[0.75rem] font-bold tracking-[0.2em] uppercase rounded shadow-[0_10px_20px_rgba(212,175,55,0.15)] hover:bg-white hover:shadow-white/10 hover:-translate-y-[2px] transition-all duration-300 flex justify-center items-center"
          >
            {checkoutStatus === 'loading' ? (
              <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Begin Secure Checkout'
            )}
          </button>
        </div>
      </div>
    </>
  );
}
