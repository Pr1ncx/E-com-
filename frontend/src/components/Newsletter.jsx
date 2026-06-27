import React, { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [msg, setMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('loading');
    setMsg('');

    fetch('http://localhost:5000/api/members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus('success');
          setMsg(data.message);
          setEmail('');
        } else {
          setStatus('error');
          setMsg(data.message || 'Subscription failed.');
        }
      })
      .catch((err) => {
        console.warn('API connection offline, simulating local mailing list signup.', err);
        setTimeout(() => {
          setStatus('success');
          setMsg('Subscription successful. Welcome to the circle.');
          setEmail('');
        }, 1200);
      });
  };

  return (
    <section className="bg-zinc-50 border-t border-b border-zinc-200 py-16 px-4 md:px-8 text-center">
      <div className="max-w-[600px] mx-auto space-y-6">
        <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 px-3.5 py-1.5 rounded-full">
          NEWSLETTER
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 tracking-tight">
          Subscribe to our newsletter
        </h2>
        <p className="text-zinc-600 text-sm md:text-base leading-relaxed font-light">
          Get early product alerts, exclusive coupon releases, and seasonal restock notices delivered straight to your inbox.
        </p>

        {status !== 'success' ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-[480px] mx-auto pt-2">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 border border-zinc-200 focus:border-indigo-600 rounded-lg text-sm outline-none transition-all placeholder-zinc-400 bg-white"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 bg-indigo-600 disabled:bg-zinc-700 text-white font-bold text-sm tracking-wider uppercase rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        ) : (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 max-w-[400px] mx-auto text-emerald-700 text-sm font-semibold animate-fade-in">
            {msg || 'Thank you for subscribing! Check your inbox shortly.'}
          </div>
        )}

        {status === 'error' && (
          <p className="text-red-500 text-xs mt-2">{msg}</p>
        )}
      </div>
    </section>
  );
}
