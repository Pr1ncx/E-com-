const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Request Interceptor logging middleware
app.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  const userEmail = req.headers['x-authenticated-user-email'];
  console.log(`\n[Backend Interceptor] [${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  if (authHeader) {
    console.log(`  └─ Authorization: ${authHeader}`);
  } else {
    console.log(`  └─ Authorization: (None)`);
  }
  if (userEmail) {
    console.log(`  └─ Authenticated User Email: ${userEmail}`);
  }
  next();
});

// Database paths
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const MEMBERS_FILE = path.join(DATA_DIR, 'members.json');

// Ensure database files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(MEMBERS_FILE)) {
  fs.writeFileSync(MEMBERS_FILE, JSON.stringify([], null, 2));
}

// Helpers
const readData = (filePath) => {
  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
};

// Catalog database with stock values for Inventory Management
let PRODUCTS = [
  {
    id: 'aurelia-chrono',
    title: 'Aurum Chronograph Watch',
    price: '₹4,999.00',
    priceVal: 4999,
    category: 'Accessories',
    image: '/assets/watch.png',
    rating: 4.8,
    reviews: 142,
    stock: 12,
    desc: 'Contemporary minimalist watch featuring Japanese quartz movement, stainless steel case, and genuine grain-leather strap.'
  },
  {
    id: 'aurelia-perfume',
    title: 'Obsidian Fragrance N°5',
    price: '₹1,899.00',
    priceVal: 1899,
    category: 'Scent',
    image: '/assets/perfume.png',
    rating: 4.7,
    reviews: 84,
    stock: 25,
    desc: 'Unisex signature perfume combining dark amber, warm vanilla, and subtle notes of patchouli and musk.'
  },
  {
    id: 'aurelia-handbag',
    title: 'Classic Leather Tote Bag',
    price: '₹3,499.00',
    priceVal: 3499,
    category: 'Accessories',
    image: '/assets/handbag.png',
    rating: 4.9,
    reviews: 196,
    stock: 8,
    desc: 'Everyday carrying tote hand-stitched with durable oiled full-grain leather, solid copper rivets, and internal zippered pouch.'
  },
  {
    id: 'aurelia-glasses',
    title: 'Horizon Aviator Sunglasses',
    price: '₹1,299.00',
    priceVal: 1299,
    category: 'Optics',
    image: '/assets/glasses.png',
    rating: 4.6,
    reviews: 73,
    stock: 15,
    desc: 'Polarized gradient lenses encased in a sturdy tortoiseshell acetate frame, providing absolute UV400 shield.'
  },
  {
    id: 'nomad-wallet',
    title: 'Nomad Bi-Fold Leather Wallet',
    price: '₹999.00',
    priceVal: 999,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviews: 110,
    stock: 20,
    desc: 'Slim profile bi-fold wallet featuring quick-access card slots, cash divider, and modern RFID blocking liners.'
  },
  {
    id: 'aerolite-buds',
    title: 'Aerolite ANC Wireless Earbuds',
    price: '₹2,999.00',
    priceVal: 2999,
    category: 'Tech',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    rating: 4.5,
    reviews: 320,
    stock: 18,
    desc: 'True wireless earbuds with active noise cancellation, customizable touch response, and 30-hour combined battery container.'
  },
  {
    id: 'ember-candle',
    title: 'Ember Sandalwood Soy Candle',
    price: '₹699.00',
    priceVal: 699,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviews: 95,
    stock: 35,
    desc: 'Hand-poured natural soy wax candle scented with organic sandalwood, cedar, and hints of rich tobacco oil.'
  },
  {
    id: 'apex-beanie',
    title: 'Apex Merino Wool Beanie',
    price: '₹599.00',
    priceVal: 599,
    category: 'Apparel',
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d435350?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviews: 215,
    stock: 40,
    desc: 'Ultra-soft, temperature-regulating Merino wool knit beanie designed for comfortable all-season everyday wear.'
  },
  {
    id: 'supercharge-pb',
    title: 'Supercharge 20000mAh Power Bank',
    price: '₹1,499.00',
    priceVal: 1499,
    category: 'Tech',
    image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
    reviews: 184,
    stock: 15,
    desc: 'High-density power bank supporting 22.5W fast charging, triple output ports, and intelligent LED level display.'
  },
  {
    id: 'aerofit-shoes',
    title: 'AeroFit Unisex Running Shoes',
    price: '₹3,999.00',
    priceVal: 3999,
    category: 'Apparel',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviews: 412,
    stock: 10,
    desc: 'Breathable mesh running shoes with responsive foam cushioning and high-grip rubber outsoles for peak performance.'
  },
  {
    id: 'felt-mat',
    title: 'Minimalist Felt Desk Mat',
    price: '₹899.00',
    priceVal: 899,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviews: 153,
    stock: 22,
    desc: 'Premium wool-felt desk organizer mat with non-slip backing, protecting workspaces and offering smooth mouse gliding.'
  },
  {
    id: 'zenith-mug',
    title: 'Zenith Ceramic Coffee Mug',
    price: '₹399.00',
    priceVal: 399,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviews: 284,
    stock: 30,
    desc: 'Handcrafted stoneware coffee mug with satin glaze finish, ergonomic handle, and double-walled heat retention.'
  },
  {
    id: 'crewneck-tshirt',
    title: 'Classic Cotton Crewneck T-Shirt',
    price: '₹799.00',
    priceVal: 799,
    category: 'Apparel',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviews: 320,
    stock: 25,
    desc: 'Heavyweight organic cotton t-shirt with classic crewneck fit and reinforced double-needle sleeve stitching.'
  },
  {
    id: 'yoga-mat',
    title: 'FlexFit Anti-Slip Yoga Mat',
    price: '₹1,199.00',
    priceVal: 1199,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviews: 98,
    stock: 14,
    desc: 'Eco-friendly TPE yoga mat with textured dual-sided grip surface, 6mm thickness, and carrying alignment lines.'
  },
  {
    id: 'lumina-glasses',
    title: 'Lumina Blue Light Glasses',
    price: '₹949.00',
    priceVal: 949,
    category: 'Optics',
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=600&q=80',
    rating: 4.5,
    reviews: 167,
    stock: 19,
    desc: 'Ergonomic blue-light filter glasses to relieve eye strains from computers, tablets, and smartphones screens.'
  },
  {
    id: 'trekker-backpack',
    title: 'Trekker Waterproof Backpack',
    price: '₹2,499.00',
    priceVal: 2499,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviews: 145,
    stock: 7,
    desc: 'Heavy-duty ripstop canvas backpack with roll-top waterproof enclosure, padded 15.6 inch laptop slot, and external straps.'
  }
];

/* --- API Endpoints --- */

// Get Products Catalog
app.get('/api/products', (req, res) => {
  res.status(200).json({
    success: true,
    data: PRODUCTS
  });
});

// Authentication: SignUp
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and password coordinates are required.'
    });
  }

  const users = readData(USERS_FILE);
  const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (exists) {
    return res.status(409).json({
      success: false,
      message: 'An account with this email is already registered.'
    });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    password // basic password storage for demonstration
  };

  users.push(newUser);
  const success = writeData(USERS_FILE, users);

  if (success) {
    res.status(201).json({
      success: true,
      message: 'Account successfully registered.',
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Failed to register account.'
    });
  }
});

// Authentication: Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.'
    });
  }

  const users = readData(USERS_FILE);
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.password !== password) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email coordinates or password combination.'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Login successful.',
    data: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

// Post Order Checkout (Inventory reduction rules applied)
app.post('/api/orders', (req, res) => {
  const { customer, items, subtotal, discount, total, couponCode } = req.body;

  if (!customer || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Customer information and order items are required.'
    });
  }

  // Inventory Management: Verify stock levels and reduce
  for (const orderItem of items) {
    const catalogItem = PRODUCTS.find(p => p.id === orderItem.id);
    if (!catalogItem) {
      return res.status(404).json({
        success: false,
        message: `Product ${orderItem.title} not found in store database.`
      });
    }
    if (catalogItem.stock < orderItem.quantity) {
      return res.status(409).json({
        success: false,
        message: `Insufficient stock for ${catalogItem.title}. Only ${catalogItem.stock} items remaining.`
      });
    }
  }

  // Deduct stock
  items.forEach(orderItem => {
    const catalogItem = PRODUCTS.find(p => p.id === orderItem.id);
    catalogItem.stock -= orderItem.quantity;
  });

  const orders = readData(ORDERS_FILE);
  const newOrder = {
    orderId: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    customer: {
      name: customer.name,
      email: customer.email,
      address: customer.address,
      city: customer.city,
      zip: customer.zip
    },
    items: items.map(i => ({
      id: i.id,
      title: i.title,
      price: i.price,
      quantity: i.quantity
    })),
    totals: {
      subtotal,
      discount: discount || 0,
      total
    },
    couponCode: couponCode || null,
    status: 'Processed & Shipped (Glow Logistics)',
    createdAt: new Date().toISOString()
  };

  orders.push(newOrder);
  const success = writeData(ORDERS_FILE, orders);

  if (success) {
    res.status(201).json({
      success: true,
      message: 'Order registered successfully and stock allocated.',
      data: newOrder
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Failed to save order details.'
    });
  }
});

// Post Newsletter Join
app.post('/api/members', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email address is required.'
    });
  }

  const members = readData(MEMBERS_FILE);
  const existing = members.find(m => m.email.toLowerCase() === email.toLowerCase());
  
  if (existing) {
    return res.status(200).json({
      success: true,
      message: 'Email already registered.'
    });
  }

  const newJoin = {
    id: `news-${Date.now()}`,
    email,
    createdAt: new Date().toISOString()
  };

  members.push(newJoin);
  writeData(MEMBERS_FILE, members);

  res.status(201).json({
    success: true,
    message: 'Subscription successful. Welcome to AuraStore newsletter circle.'
  });
});

app.listen(PORT, () => {
  console.log(`Shopify-style E-commerce API running on http://localhost:${PORT}`);
});
