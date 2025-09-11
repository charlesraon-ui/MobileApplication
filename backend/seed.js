const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./database');

const MOCK_PRODUCTS = [
  { id: '1', name: 'Organic Fertilizers', category: 'Fertilizers', price: 25.00, imageUrl: 'https://placehold.co/400x400/22c55e/ffffff?text=Fertilizers' },
  { id: '2', name: 'Fresh Tomatoes', category: 'Vegetables', price: 3.50, imageUrl: 'https://placehold.co/400x400/ef4444/ffffff?text=Tomatoes' },
  { id: '3', name: 'Gardening Shovel', category: 'Farm Tools', price: 15.00, imageUrl: 'https://placehold.co/400x400/94a3b8/ffffff?text=Shovel' },
  { id: '4', name: 'Seeds Collection', category: 'Seeds', price: 10.00, imageUrl: 'https://placehold.co/400x400/a855f7/ffffff?text=Seeds' },
  { id: '5', name: 'Organic Pesticide', category: 'Pesticides', price: 30.00, imageUrl: 'https://placehold.co/400x400/22c55e/ffffff?text=Pesticide' },
  { id: '6', name: 'Farm Boots', category: 'Apparel', price: 50.00, imageUrl: 'https://placehold.co/400x400/4f46e5/ffffff?text=Boots' },
  { id: '7', name: 'Potato Harvestor', category: 'Farm Tools', price: 120.00, imageUrl: 'https://placehold.co/400x400/94a3b8/ffffff?text=Harvestor' },
  { id: '8', name: 'Fresh Onions', category: 'Vegetables', price: 2.50, imageUrl: 'https://placehold.co/400x400/ef4444/ffffff?text=Onions' },
];

const seedDatabase = async () => {
    await connectDB();
    try {
        await Product.deleteMany({});
        await Product.insertMany(MOCK_PRODUCTS);
        console.log('Database seeded with mock products.');
    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        mongoose.connection.close();
    }
};

seedDatabase();