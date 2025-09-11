import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import productController from '../controllers/productController.js';
import cartController from '../controllers/cartController.js';
import orderController from '../controllers/orderController.js';
import authController from './controllers/authController.js'; // If `authController.js` is in the same directory as `server.js`


const router = express.Router();

// Product routes
router.get('/products', productController.getProducts);

// Cart routes
router.get('/cart/:userId', cartController.getCart);
router.post('/cart', cartController.updateCart);

// Order routes
router.post('/orders', orderController.createOrder);
router.get('/orders/:userId', orderController.getOrders);

// Register a new user
router.post('/register',authController.register);

// Login a user
router.post('/login', authController.login)

export default router;
