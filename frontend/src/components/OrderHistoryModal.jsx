import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function OrderHistoryModal({ isOpen, onClose }) {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    if (isOpen && currentUser?.email) {
      setLoading(true);
      setError(null);
      
      // Fetch user's order history from the backend
      fetch(`http://localhost:5000/api/orders/history?email=${encodeURIComponent(currentUser.email)}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to retrieve order history.');
          }
          return res.json();
        })
        .then((data) => {
          if (data.success) {
            // Sort by date descending (newest first)
            const sortedOrders = (data.data || []).sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setOrders(sortedOrders);
          } else {
            throw new Error(data.message || 'An error occurred fetching orders.');
          }
        })
        .catch((err) => {
          console.error('[OrderHistory] Error fetching orders:', err);
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  const getStatusStyle = (status) => {
    const s = status ? status.toLowerCase() : '';
    if (s.includes('ship') || s.includes('process') || s.includes('deliver')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (s.includes('cancel') || s.includes('failed')) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-50 flex justify-center items-center p-4">
      {/* Click outside to close overlay */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="bg-white border border-zinc-200 shadow-2xl rounded-2xl w-full max-w-[680px] overflow-hidden relative z-10 p-6 md:p-10 flex flex-col justify-between max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-zinc-100 pb-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-zinc-950 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
              Order History
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Registered Account: <span className="font-semibold text-zinc-600">{currentUser?.email}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-full hover:bg-zinc-100 transition-all"
            aria-label="Close Order History"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Orders list container */}
        <div className="flex-1 overflow-y-auto pr-1 -mr-2 space-y-4 mb-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-zinc-500 text-xs mt-4">Retrieving your boutique orders...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 border border-zinc-100 rounded-xl bg-zinc-50">
              <svg className="w-12 h-12 text-rose-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <h4 className="text-sm font-bold text-zinc-800 mb-1">Failed to Load Orders</h4>
              <p className="text-zinc-500 text-xs max-w-[280px] mx-auto">{error}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-zinc-200 rounded-2xl p-6 bg-zinc-50/50">
              <svg className="w-12 h-12 text-zinc-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              <h4 className="text-sm font-bold text-zinc-800 mb-1">No Orders Found</h4>
              <p className="text-zinc-500 text-xs max-w-[280px] mx-auto">
                You have not placed any orders yet. Add items to your bag and complete checkout to see them here.
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const isExpanded = expandedOrderId === order.orderId;
              return (
                <div
                  key={order.orderId}
                  className={`border rounded-xl transition-all duration-300 overflow-hidden ${
                    isExpanded ? 'border-zinc-300 shadow-md bg-white' : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/40 hover:bg-white'
                  }`}
                >
                  {/* Order Card Summary (clickable header) */}
                  <div
                    onClick={() => toggleExpand(order.orderId)}
                    className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                          {order.orderId}
                        </span>
                        <span className={`text-[0.65rem] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 font-medium">
                        Ordered on {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right sm:space-y-0.5">
                        <span className="text-[0.65rem] text-zinc-400 block sm:inline mr-1 uppercase font-bold tracking-wider">Total</span>
                        <span className="font-bold text-zinc-900 text-sm">
                          ₹{(order.totals?.total || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                      
                      <div className="p-1 rounded-full hover:bg-zinc-100 transition-colors">
                        <svg
                          className={`w-5 h-5 text-zinc-400 transform transition-transform duration-300 ${isExpanded ? 'rotate-180 text-zinc-700' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="border-t border-zinc-200 bg-white p-4 md:p-5 space-y-4 animate-fade-in">
                      {/* Products list */}
                      <div>
                        <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2.5">Items Summary</h4>
                        <div className="divide-y divide-zinc-100 border border-zinc-100 rounded-lg overflow-hidden">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="p-3 flex items-center justify-between text-xs hover:bg-zinc-50/50 transition-colors">
                              <div className="font-medium text-zinc-800">
                                {item.title}
                                <span className="text-zinc-400 font-bold ml-1.5 text-[0.7rem]">x{item.quantity}</span>
                              </div>
                              <div className="font-mono text-zinc-600 font-medium">
                                {item.price}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping information & Financials Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-zinc-100">
                        {/* Shipping Coordinates */}
                        <div className="space-y-1.5 text-xs">
                          <h5 className="font-bold text-zinc-700 uppercase tracking-wider text-[0.65rem]">Shipping Address</h5>
                          <div className="text-zinc-600 leading-relaxed font-medium">
                            <p className="font-semibold text-zinc-800">{order.customer.name}</p>
                            <p>{order.customer.address}</p>
                            <p>{order.customer.city}, {order.customer.zip}</p>
                            <p className="text-zinc-400 mt-1 italic">Deliverer: Glow Logistics Hub</p>
                          </div>
                        </div>

                        {/* Totals Invoice Box */}
                        <div className="space-y-2 text-xs bg-zinc-50 border border-zinc-100 rounded-xl p-3.5">
                          <h5 className="font-bold text-zinc-700 uppercase tracking-wider text-[0.65rem] border-b border-zinc-200/60 pb-1.5 mb-1.5">Payment Summary</h5>
                          <div className="flex justify-between text-zinc-500 font-medium">
                            <span>Subtotal</span>
                            <span>₹{(order.totals?.subtotal || 0).toLocaleString('en-IN')}</span>
                          </div>
                          {order.totals?.discount > 0 && (
                            <div className="flex justify-between text-indigo-600 font-semibold">
                              <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
                              <span>-₹{(order.totals.discount).toLocaleString('en-IN')}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-zinc-500 font-medium border-t border-zinc-200/50 pt-1.5">
                            <span>Shipping</span>
                            <span className="text-emerald-600 font-semibold">FREE</span>
                          </div>
                          <div className="flex justify-between text-zinc-900 font-bold text-sm border-t border-zinc-200 pt-1.5">
                            <span>Total Charged</span>
                            <span>₹{(order.totals?.total || 0).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        <div className="border-t border-zinc-100 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-zinc-200 hover:border-zinc-300 text-zinc-700 hover:bg-zinc-50 font-bold text-xs uppercase tracking-wider rounded-lg transition-all"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
}
