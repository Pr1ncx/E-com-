import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-200 text-zinc-500 pt-16 pb-8 px-4 md:px-8">
      <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
        {/* Brand Block */}
        <div className="space-y-4">
          <div className="text-lg font-bold text-zinc-900 tracking-wider flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            AURA<span className="text-indigo-600">STORE</span>
          </div>
          <p className="text-xs leading-relaxed font-light text-zinc-400">
            A premium, high-fidelity e-commerce experience designed for everyday convenience and absolute functional excellence.
          </p>
        </div>

        {/* Links Column 1 */}
        <div>
          <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-widest mb-4">Shop Collections</h4>
          <ul className="list-none space-y-2.5 text-xs">
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Accessories</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Scent Collections</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Optics Wear</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Everyday Wear</a></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div>
          <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-widest mb-4">Customer Care</h4>
          <ul className="list-none space-y-2.5 text-xs">
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Links Column 3 */}
        <div>
          <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-widest mb-4">Get in Touch</h4>
          <ul className="list-none space-y-2.5 text-xs text-zinc-400">
            <li>Email: support@aurastore.com</li>
            <li>Hours: Mon - Fri | 9 AM - 6 PM</li>
            <li>Location: New York, NY</li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto border-t border-zinc-100 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
        <p>&copy; 2026 AuraStore Inc. Powered by Shopify.</p>
        
        {/* Payment Badges */}
        <div className="flex gap-2 items-center text-zinc-400">
          {/* Visa */}
          <div className="border border-zinc-200 rounded px-2 py-1 bg-zinc-50 font-bold text-[0.6rem] tracking-wide text-zinc-700">VISA</div>
          {/* Mastercard */}
          <div className="border border-zinc-200 rounded px-2 py-1 bg-zinc-50 font-bold text-[0.6rem] tracking-wide text-zinc-700">MC</div>
          {/* Paypal */}
          <div className="border border-zinc-200 rounded px-2 py-1 bg-zinc-50 font-bold text-[0.6rem] tracking-wide text-zinc-700">PAYPAL</div>
          {/* Apple Pay */}
          <div className="border border-zinc-200 rounded px-2 py-1 bg-zinc-50 font-bold text-[0.6rem] tracking-wide text-zinc-700">APPLE PAY</div>
        </div>
      </div>
    </footer>
  );
}
