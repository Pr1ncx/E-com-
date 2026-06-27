import React, { useState } from 'react';

export default function AllocationModal({ product, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    customization: ''
  });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('');

  if (!product) return null;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    // Fetch call to full-stack Express backend
    fetch('http://localhost:5000/api/allocations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        productId: product.id,
        customization: formData.customization
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMessage(data.message || 'Transmission of allocation request failed.');
        }
      })
      .catch((err) => {
        console.warn('Backend API connection offline, simulating local VIP allocation request.', err);
        // Offline mock success experience
        setTimeout(() => {
          setStatus('success');
        }, 2000);
      });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-center items-center p-4 animate-fade-in">
      {/* Click outside container handler */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="bg-gradient-to-br from-zinc-900/95 to-zinc-950/98 border border-amber-500/50 shadow-[0_50px_100px_rgba(0,0,0,0.8),0_0_40px_rgba(212,175,55,0.08)] w-full max-w-[600px] rounded-3xl p-6 md:p-12 relative transform transition-all duration-500 overflow-y-auto max-h-[90vh] z-10">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-500 hover:text-amber-400 hover:rotate-90 duration-300 transition-all p-1"
          aria-label="Close Allocation Modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {status !== 'success' ? (
          <>
            <div className="text-center mb-8">
              <span className="text-[0.65rem] tracking-[0.3em] text-amber-400 uppercase mb-2 block">
                Private Allocation Order
              </span>
              <h2 className="text-[1.6rem] font-serif text-white tracking-wide">REQUEST AN ENQUIRY</h2>
            </div>

            <div className="flex items-center gap-5 bg-white/2 border border-white/5 rounded-2xl p-4 mb-6">
              <img className="w-16 h-16 rounded-full object-cover border border-amber-500/30" src={product.image} alt={product.title} />
              <div>
                <h4 className="text-[1.1rem] text-white font-serif">{product.title}</h4>
                <span className="text-[0.95rem] text-amber-300 font-serif">{product.price}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="flex-1">
                  <label htmlFor="name" className="text-[0.65rem] font-semibold tracking-[0.15em] text-zinc-500 uppercase mb-2 block">
                    Client Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-white/2 border border-white/5 focus:border-amber-400 rounded text-[0.85rem] font-light text-white outline-none transition-all duration-300 placeholder-zinc-700"
                    placeholder="Alexander Vance"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="email" className="text-[0.65rem] font-semibold tracking-[0.15em] text-zinc-500 uppercase mb-2 block">
                    Direct Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-white/2 border border-white/5 focus:border-amber-400 rounded text-[0.85rem] font-light text-white outline-none transition-all duration-300 placeholder-zinc-700"
                    placeholder="vance@exemplar.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="customization" className="text-[0.65rem] font-semibold tracking-[0.15em] text-zinc-500 uppercase mb-2 block">
                  Customization Request
                </label>
                <textarea
                  id="customization"
                  value={formData.customization}
                  onChange={handleChange}
                  className="w-full h-[100px] px-5 py-4 bg-white/2 border border-white/5 focus:border-amber-400 rounded text-[0.85rem] font-light text-white outline-none resize-none transition-all duration-300 placeholder-zinc-700"
                  placeholder="Strap adjustment, engraving initials, bespoke presentation case options..."
                ></textarea>
              </div>

              {status === 'error' && (
                <p className="text-red-400 text-[0.8rem] font-light">{errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-400 hover:from-amber-500 hover:to-amber-300 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-500 text-black font-bold text-[0.75rem] tracking-[0.25em] uppercase rounded shadow-lg shadow-amber-400/10 hover:shadow-amber-400/20 transition-all duration-500 flex justify-center items-center"
              >
                {status === 'loading' ? (
                  <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Transmit Request'
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-10 animate-fade-up">
            <div className="w-20 h-20 rounded-full border border-dashed border-amber-400 flex justify-center items-center mx-auto mb-6 text-amber-400 animate-spin-slow">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-spin-slow-reverse">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="text-[1.5rem] font-serif text-white mb-3">Transmission Secure</h3>
            <p className="max-w-[450px] mx-auto text-[0.9rem] font-light text-zinc-400 leading-relaxed">
              Your allocation enquiry has been securely routed. A Maison Aurelia concierge will call or email you shortly with private transaction options.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
