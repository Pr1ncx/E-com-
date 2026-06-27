import React, { useState } from 'react';
import { useBag } from '../context/BagContext';
import { useAuth } from '../context/AuthContext';

export default function CartDrawer({ onOpenCheckout }) {
  const {
    bagItems,
    removeFromBag,
    increaseQuantity,
    decreaseQuantity,
    getSubtotal,
    getDiscountAmount,
    getShipping,
    getTax,
    getTotal,
    isBagOpen,
    setIsBagOpen,
    couponCode,
    applyCoupon,
    removeCoupon
  } = useBag();

  const { currentUser, setIsAuthModalOpen } = useAuth();
  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState({ type: '', text: '' }); // type: success | error

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyCoupon(promoInput);
    if (res.success) {
      setPromoMsg({ type: 'success', text: res.message });
      setPromoInput('');
    } else {
      setPromoMsg({ type: 'error', text: res.message });
    }
  };

  const handleCheckoutClick = () => {
    if (!currentUser) {
      // Prompt user to authenticate first
      setIsAuthModalOpen(true);
    } else {
      setIsBagOpen(false);
      onOpenCheckout();
    }
  };

  // Free shipping threshold calculator (₹1,500)
  const freeShippingThreshold = 1500;
  const progressPercent = Math.min((getSubtotal() / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = freeShippingThreshold - getSubtotal();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setIsBagOpen(false)}
        className={`fixed inset-0 bg-black/50 backdrop-blur-[1px] z-40 transition-opacity duration-300 ${
          isBagOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      ></div>

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 w-full max-w-[440px] h-screen bg-white border-l border-zinc-200 shadow-2xl z-50 flex flex-col transition-all duration-300 ${
          isBagOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-zinc-200 flex justify-between items-center bg-zinc-50">
          <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            Your Shopping Cart
          </h3>
          <button
            onClick={() => setIsBagOpen(false)}
            className="text-zinc-400 hover:text-zinc-700 p-1 bg-white border border-zinc-200 rounded-full hover:shadow-sm transition-all"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        {getSubtotal() > 0 && (
          <div className="px-6 py-4 bg-indigo-50/50 border-b border-zinc-100">
            <p className="text-xs text-indigo-900 font-medium mb-2">
              {remainingForFreeShipping > 0 ? (
                <>Add <span className="font-bold">₹{remainingForFreeShipping.toLocaleString('en-IN')}</span> more for <span className="font-bold">FREE SHIPPING</span></>
              ) : (
                <span className="text-emerald-700 font-bold">🎉 Congratulations! You qualify for Free Shipping!</span>
              )}
            </p>
            <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${remainingForFreeShipping > 0 ? 'bg-indigo-600' : 'bg-emerald-500'}`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {bagItems.length === 0 ? (
            <div className="text-center py-20 text-zinc-400">
              <svg className="w-12 h-12 mx-auto mb-4 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              <h4 className="text-sm font-bold text-zinc-600 uppercase mb-1">Your cart is empty</h4>
              <p className="text-xs text-zinc-500">Fill your cart with our premium essential selections.</p>
            </div>
          ) : (
            bagItems.map((item) => (
              <div key={item.id} className="flex gap-4 pb-5 border-b border-zinc-100 items-start">
                <div className="w-20 h-20 bg-zinc-50 border border-zinc-100 rounded-lg flex items-center justify-center p-2 flex-shrink-0">
                  <img className="max-h-full max-w-full object-contain rounded" src={item.image} alt={item.title} />
                </div>
                
                <div className="flex-1 flex flex-col justify-between h-full">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 leading-snug">{item.title}</h4>
                    <span className="text-xs text-zinc-400 capitalize">{item.category}</span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity selectors */}
                    <div className="inline-flex items-center border border-zinc-200 rounded-lg overflow-hidden h-[30px]">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="w-8 h-full bg-zinc-50 hover:bg-zinc-100 border-r border-zinc-200 text-zinc-600 flex justify-center items-center"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-semibold text-zinc-800">{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="w-8 h-full bg-zinc-50 hover:bg-zinc-100 border-l border-zinc-200 text-zinc-600 flex justify-center items-center"
                      >
                        +
                      </button>
                    </div>
                    
                    <span className="text-sm font-extrabold text-zinc-900">
                      ₹{(item.priceVal * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => removeFromBag(item.id)}
                  className="text-zinc-400 hover:text-red-500 p-1"
                  aria-label="Remove item"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Summary & Checkout Panel */}
        {bagItems.length > 0 && (
          <div className="p-6 border-t border-zinc-200 bg-zinc-50 space-y-4">
            {/* Promo Code input form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                placeholder="PROMO CODE (e.g. SUMMER10)"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="flex-1 text-xs border border-zinc-200 rounded-lg px-3 py-2 text-zinc-800 bg-white placeholder-zinc-400 focus:outline-none focus:border-indigo-600"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-zinc-800 text-white text-xs font-semibold rounded-lg hover:bg-zinc-900 transition-colors uppercase"
              >
                Apply
              </button>
            </form>

            {promoMsg.text && (
              <p className={`text-[0.7rem] ${promoMsg.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                {promoMsg.text}
              </p>
            )}

            {couponCode && (
              <div className="flex justify-between items-center bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2.5">
                <span className="text-xs font-bold text-emerald-800 uppercase">Coupon Active: {couponCode}</span>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-xs text-emerald-700 hover:text-red-500 underline font-semibold"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Calculations summaries */}
            <div className="text-xs text-zinc-600 space-y-2 pt-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900">₹{getSubtotal().toLocaleString('en-IN')}</span>
              </div>
              {getDiscountAmount() > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount</span>
                  <span>-₹{getDiscountAmount().toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-zinc-900">
                  {getShipping() === 0 ? 'FREE' : `₹${getShipping()}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Est. GST (18%)</span>
                <span className="font-semibold text-zinc-900">₹{getTax().toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-zinc-900 pt-2 border-t border-zinc-200">
                <span>Total</span>
                <span>₹{getTotal().toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Authorization warnings */}
            {!currentUser && (
              <p className="text-[0.7rem] text-amber-600 text-center font-semibold bg-amber-50 border border-amber-100 rounded py-2">
                ⚠️ Please Sign In to proceed to checkout.
              </p>
            )}

            <button
              onClick={handleCheckoutClick}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm tracking-wider uppercase rounded-xl shadow-md hover:shadow-lg transition-all flex justify-center items-center mt-4"
            >
              {currentUser ? 'Proceed to Checkout' : 'Sign In to Checkout'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
