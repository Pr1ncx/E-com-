import React, { createContext, useContext, useState, useEffect } from 'react';

const BagContext = createContext();

export function BagProvider({ children }) {
  const [bagItems, setBagItems] = useState([]);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Load cart from localStorage
  useEffect(() => {
    const savedBag = localStorage.getItem('shopify_cart_bag_inr');
    if (savedBag) {
      try {
        setBagItems(JSON.parse(savedBag));
      } catch (e) {
        console.error('Error loading cart data', e);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('shopify_cart_bag_inr', JSON.stringify(bagItems));
  }, [bagItems]);

  const addToBag = (product, quantity = 1) => {
    setBagItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  };

  const removeFromBag = (productId) => {
    setBagItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const increaseQuantity = (productId) => {
    setBagItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setBagItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearBag = () => {
    setBagItems([]);
    setCouponCode('');
    setDiscountPercent(0);
  };

  const applyCoupon = (code) => {
    const upperCode = code.toUpperCase().trim();
    if (upperCode === 'SUMMER10') {
      setCouponCode('SUMMER10');
      setDiscountPercent(10);
      return { success: true, message: 'SUMMER10 coupon applied (10% discount)' };
    } else if (upperCode === 'VIP20') {
      setCouponCode('VIP20');
      setDiscountPercent(20);
      return { success: true, message: 'VIP20 coupon applied (20% discount)' };
    }
    return { success: false, message: 'Invalid coupon code' };
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercent(0);
  };

  const getSubtotal = () => {
    return bagItems.reduce((acc, item) => acc + item.priceVal * item.quantity, 0);
  };

  const getDiscountAmount = () => {
    return Math.round((getSubtotal() * discountPercent) / 100);
  };

  const getShipping = () => {
    const subtotal = getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal >= 1500 ? 0 : 99; // Free shipping over ₹1,500, otherwise ₹99
  };

  const getTax = () => {
    return Math.round((getSubtotal() - getDiscountAmount()) * 0.18); // 18% GST in India
  };

  const getTotal = () => {
    return getSubtotal() - getDiscountAmount() + getShipping() + getTax();
  };

  const getItemsCount = () => {
    return bagItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  return (
    <BagContext.Provider
      value={{
        bagItems,
        addToBag,
        removeFromBag,
        increaseQuantity,
        decreaseQuantity,
        clearBag,
        getSubtotal,
        getDiscountAmount,
        getShipping,
        getTax,
        getTotal,
        getItemsCount,
        isBagOpen,
        setIsBagOpen,
        couponCode,
        discountPercent,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </BagContext.Provider>
  );
}

export function useBag() {
  return useContext(BagContext);
}
