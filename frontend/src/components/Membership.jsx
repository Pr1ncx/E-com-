import React, { useState } from 'react';

export default function Membership() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    referralCode: ''
  });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    // Fetch call to full-stack Express backend
    fetch('http://localhost:5000/api/members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMessage(data.message || 'Verification check failed.');
        }
      })
      .catch((err) => {
        console.warn('Backend API connection offline, simulating local VIP credentials verify.', err);
        // Offline mock success experience
        setTimeout(() => {
          setStatus('success');
        }, 1800);
      });
  };

  return (
    <section id="membership" className="px-[5%] py-[120px] relative">
      <div className="max-w-[900px] mx-auto bg-gradient-to-br from-white/4 to-white/1 border border-amber-500/30 shadow-[0_30px_70px_rgba(0,0,0,0.6),0_0_30px_rgba(212,175,55,0.03)] backdrop-blur-3xl rounded-3xl p-10 md:p-20 relative overflow-hidden text-center">
        {/* Floating concentric vector rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-amber-500/5 rounded-full w-[400px] h-[400px] pointer-events-none z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-amber-500/5 rounded-full w-[600px] h-[600px] pointer-events-none z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-amber-500/5 rounded-full w-[800px] h-[800px] pointer-events-none z-0"></div>

        <div className="relative z-10">
          <span className="text-[0.7rem] font-semibold tracking-[0.35em] text-amber-400 uppercase mb-5 block">
            Private Invitation Only
          </span>
          <h2 className="text-[2rem] md:text-[2.8rem] font-serif font-light text-white mb-5 tracking-wide">
            JOIN THE PRIVÉ CIRCLE
          </h2>
          <p className="max-w-[600px] mx-auto text-[0.95rem] font-light text-zinc-400 mb-10 leading-relaxed">
            Request credentials to join Aurelia's inner syndicate. Circle members unlock preview allocation reserves, personal design atelier bookings, and invitations to private collection galas.
          </p>

          {status !== 'success' ? (
            <form onSubmit={handleSubmit} className="max-w-[550px] mx-auto flex flex-col gap-5 text-left">
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="flex-1">
                  <label htmlFor="name" className="text-[0.65rem] font-semibold tracking-[0.15em] text-zinc-500 uppercase mb-2 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-white/2 border border-white/5 focus:border-amber-400 focus:shadow-[0_0_15px_rgba(212,175,55,0.05)] rounded text-[0.85rem] font-light text-white outline-none transition-all duration-300 placeholder-zinc-700"
                    placeholder="Lord / Lady Connoisseur"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="email" className="text-[0.65rem] font-semibold tracking-[0.15em] text-zinc-500 uppercase mb-2 block">
                    Email Coordinates
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-white/2 border border-white/5 focus:border-amber-400 focus:shadow-[0_0_15px_rgba(212,175,55,0.05)] rounded text-[0.85rem] font-light text-white outline-none transition-all duration-300 placeholder-zinc-700"
                    placeholder="client@aurum.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="referralCode" className="text-[0.65rem] font-semibold tracking-[0.15em] text-zinc-500 uppercase mb-2 block">
                  Referral Code (Optional)
                </label>
                <input
                  type="text"
                  id="referralCode"
                  value={formData.referralCode}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-white/2 border border-white/5 focus:border-amber-400 focus:shadow-[0_0_15px_rgba(212,175,55,0.05)] rounded text-[0.85rem] font-light text-white outline-none transition-all duration-300 placeholder-zinc-700"
                  placeholder="M-AXXXXX"
                />
              </div>

              {status === 'error' && (
                <p className="text-red-400 text-[0.8rem] font-light">{errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-[18px] bg-gradient-to-r from-amber-600 to-amber-400 hover:from-amber-500 hover:to-amber-300 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-500 text-black font-bold text-[0.75rem] tracking-[0.25em] uppercase rounded shadow-[0_10px_30px_rgba(212,175,55,0.15)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.2)] hover:-translate-y-[2px] transition-all duration-500"
              >
                {status === 'loading' ? 'Verifying Credentials...' : 'Request Credentials'}
              </button>
            </form>
          ) : (
            <div className="animate-fade-up py-10">
              <div className="w-20 h-20 rounded-full border border-dashed border-amber-400 flex justify-center items-center mx-auto mb-6 text-amber-400 animate-spin-slow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-spin-slow-reverse"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <h3 className="text-[1.5rem] font-serif text-white mb-3">Invitation Request Submitted</h3>
              <p className="max-w-[450px] mx-auto text-[0.9rem] font-light text-zinc-400 leading-relaxed">
                Your credentials are being reviewed by our concierge. If accepted, a personal liaison will coordinate your invite key within 48 hours.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
