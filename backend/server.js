require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Start Avatar.ai server automatically
const avatarPath = path.join(__dirname, '..', 'Avatar.ai');
console.log('Starting Avatar.ai server...');
const avatarServer = spawn('python', ['app.py'], {
  cwd: avatarPath,
  stdio: 'inherit',
  shell: true
});

avatarServer.on('error', (err) => {
  console.log('Note: Avatar.ai server could not auto-start:', err.message);
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('MongoDB connection error:', err));

// Schemas
const ProductSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true },
    fabricType: { type: String },
    width: { type: Number },
    gsm: { type: Number },
    colorOptions: [{
        colorLabel: String,
        quantity: Number
    }],
    stockHistory: [{
        type: { type: String, enum: ['added', 'sold', 'adjusted'] },
        quantity: Number,
        date: { type: Date, default: Date.now },
        reason: String
    }],
    images: [String]
});

const OrderSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    items: [{
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 }
    }],
    totalAmount: { type: Number, required: true, min: 0 },
    taxDetails: {
        subTotal: Number,
        totalTax: Number
    },
    status: { type: String, enum: ['booked', 'orders dispatched', 'delivered'], default: 'booked' },
    paymentMode: { type: String, enum: ['offline', 'online'], required: true },
    deliveryMode: { type: String, enum: ['self', 'delivery'], required: true },
    discountAmount: { type: Number, default: 0, min: 0 },
    orderDate: { type: Date, default: Date.now }
});

const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true, validate: {
        validator: function(v) {
            return /^\d{10}$/.test(v);
        },
        message: 'Mobile number must be exactly 10 digits'
    }},
    email: { type: String, validate: {
        validator: function(v) {
            return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Invalid email format'
    }},
    address: {
        doorNumber: String,
        street: String,
        area: String,
        city: String,
        pincode: { type: String, validate: {
            validator: function(v) {
                return /^\d{6}$/.test(v);
            },
            message: 'Pincode must be exactly 6 digits'
        }}
    },
    loyaltyPoints: { type: Number, default: 0 }
});

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const CartSchema = new mongoose.Schema({
    sessionId: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        selectedColor: String,
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);
const Customer = mongoose.model('Customer', CustomerSchema);
const User = mongoose.model('User', UserSchema);
const Cart = mongoose.model('Cart', CartSchema);

// Routes

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Cart Routes
app.get('/api/cart', async (req, res) => {
    try {
        const sessionId = req.headers.sessionid || 'default-session';
        let cart = await Cart.findOne({ sessionId }).populate('items.product');
        
        if (!cart) {
            cart = new Cart({ sessionId, items: [], totalAmount: 0 });
            await cart.save();
            cart = await Cart.findById(cart._id).populate('items.product');
        }
        
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/cart', async (req, res) => {
    try {
        const sessionId = req.headers.sessionid || 'default-session';
        const { productId, quantity = 1, selectedColor } = req.body;
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }
        
        let cart = await Cart.findOne({ sessionId });
        
        if (!cart) {
            cart = new Cart({ sessionId, items: [], totalAmount: 0 });
        }
        
        const existingItem = cart.items.find(item => 
            item.product.toString() === productId && 
            item.selectedColor === selectedColor
        );
        
        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (product.stock < newQuantity) {
                return res.status(400).json({ message: 'Insufficient stock' });
            }
            existingItem.quantity = newQuantity;
        } else {
            cart.items.push({
                product: productId,
                quantity,
                selectedColor,
                price: product.price
            });
        }
        
        // Calculate total amount
        cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        cart.updatedAt = new Date();
        
        await cart.save();
        const populatedCart = await Cart.findById(cart._id).populate('items.product');
        
        res.json(populatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/cart/:itemId', async (req, res) => {
    try {
        const sessionId = req.headers.sessionid || 'default-session';
        const { itemId } = req.params;
        const { quantity } = req.body;
        
        let cart = await Cart.findOne({ sessionId });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        
        const item = cart.items.id(itemId);
        
        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }
        
        const product = await Product.findById(item.product);
        if (product && product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }
        
        if (quantity <= 0) {
            cart.items.pull(itemId);
        } else {
            item.quantity = quantity;
        }
        
        cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        cart.updatedAt = new Date();
        
        await cart.save();
        const populatedCart = await Cart.findById(cart._id).populate('items.product');
        
        res.json(populatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/cart/:itemId', async (req, res) => {
    try {
        const sessionId = req.headers.sessionid || 'default-session';
        const { itemId } = req.params;
        
        let cart = await Cart.findOne({ sessionId });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        
        cart.items.pull(itemId);
        cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        cart.updatedAt = new Date();
        
        await cart.save();
        const populatedCart = await Cart.findById(cart._id).populate('items.product');
        
        res.json(populatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/cart', async (req, res) => {
    try {
        const sessionId = req.headers.sessionid || 'default-session';
        
        await Cart.findOneAndUpdate(
            { sessionId },
            { items: [], totalAmount: 0, updatedAt: new Date() },
            { upsert: true }
        );
        
        res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create order
app.post('/api/orders', async (req, res) => {
    try {
        const { customer, items, paymentMode, deliveryMode, discountAmount = 0 } = req.body;
        
        // Calculate total amount
        let subTotal = 0;
        for (const item of items) {
            const product = await Product.findById(item._id);
            if (!product) {
                return res.status(400).json({ message: `Product with ID ${item._id} not found` });
            }
            subTotal += product.price * item.quantity;
        }
        
        const totalTax = subTotal * 0.18; // 18% GST
        const totalAmount = subTotal + totalTax - discountAmount;
        
        const order = new Order({
            customer,
            items,
            totalAmount,
            taxDetails: {
                subTotal,
                totalTax
            },
            paymentMode,
            deliveryMode,
            discountAmount
        });
        
        const savedOrder = await order.save();
        
        // Update stock for each product
        for (const item of items) {
            await Product.findByIdAndUpdate(item._id, {
                $inc: { stock: -item.quantity },
                $push: {
                    stockHistory: {
                        type: 'sold',
                        quantity: item.quantity,
                        date: new Date(),
                        reason: `Order #${savedOrder._id}`
                    }
                }
            });
        }
        
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get orders
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().populate('customer').populate('items._id').sort({ orderDate: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get order by ID
app.get('/api/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('customer').populate('items._id');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Customer routes
app.post('/api/customers', async (req, res) => {
    try {
        const customer = new Customer(req.body);
        const savedCustomer = await customer.save();
        res.status(201).json(savedCustomer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/api/customers', async (req, res) => {
    try {
        const customers = await Customer.find().sort({ name: 1 });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/customers/:mobile', async (req, res) => {
    try {
        const customer = await Customer.findOne({ mobile: req.params.mobile });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update customer
app.put('/api/customers/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json(customer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Add loyalty points
app.post('/api/customers/:id/loyalty', async (req, res) => {
    try {
        const { points } = req.body;
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            { $inc: { loyaltyPoints: points } },
            { new: true }
        );
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json(customer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// User registration
app.post('/api/register', async (req, res) => {
    try {
        console.log('Registration request received:', req.body);
        const { name, email, password } = req.body;
        
        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists:', email);
            return res.status(400).json({ message: 'Email already registered' });
        }
        
        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed successfully');
        
        const user = new User({
            name,
            email,
            password: hashedPassword
        });
        
        const savedUser = await user.save();
        console.log('User saved successfully:', savedUser.email);
        res.status(201).json({ 
            message: 'User registered successfully',
            user: { name: savedUser.name, email: savedUser.email }
        });
    } catch (error) {
        console.error('Registration error details:', error);
        if (error.code === 11000) {
            // Duplicate key error
            res.status(400).json({ message: 'Email already registered' });
        } else {
            res.status(500).json({ message: 'Registration failed. Please try again.' });
        }
    }
});

// User login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (user) {
            // Compare hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            
            if (isPasswordValid) {
                const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
                res.json({ 
                    token, 
                    user: { name: user.name, email: user.email, id: user._id }
                });
            } else {
                res.status(401).json({ message: 'Invalid email or password' });
            }
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed. Please try again.' });
    }
});

// Clear users for testing
app.post('/api/clear-users', async (req, res) => {
    try {
        await User.deleteMany({});
        res.json({ message: 'All users cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Initialize products data
// Clear all products (for testing)
app.delete('/api/products', async (req, res) => {
    try {
        const result = await Product.deleteMany({});
        res.json({ message: `Deleted ${result.deletedCount} products` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/init-products', async (req, res) => {
    try {
        await Product.deleteMany({});
        
        const products = [
            { 
                id: 1, 
                sku: "SLK-001", 
                name: "Chanderi Silk", 
                category: "Silk", 
                price: 2400, 
                stock: 100, 
                unit: "metre", 
                fabricType: "Handwoven Chanderi Silk",
                width: 44,
                gsm: 60,
                colorOptions: [
                    { colorLabel: "Pink", quantity: 50 },
                    { colorLabel: "Blue", quantity: 30 },
                    { colorLabel: "Cream", quantity: 20 }
                ],
                stockHistory: [
                    { type: "added", quantity: 100, date: new Date(), reason: "Initial stock" }
                ],
                images: ["https://res.cloudinary.com/daugnr7ba/image/upload/v1/fabrics/chanderi_silk_1.jpg"]
            },
            { 
                id: 2, 
                sku: "COT-002", 
                name: "Khadi Cotton", 
                category: "Cotton", 
                price: 680, 
                stock: 150, 
                unit: "metre", 
                fabricType: "Hand-spun Khadi Cotton",
                width: 36,
                gsm: 120,
                colorOptions: [
                    { colorLabel: "Natural", quantity: 80 },
                    { colorLabel: "Brown", quantity: 70 }
                ],
                stockHistory: [
                    { type: "added", quantity: 150, date: new Date(), reason: "Initial stock" }
                ],
                images: ["https://res.cloudinary.com/daugnr7ba/image/upload/v1/fabrics/khadi_cotton_1.jpg"]
            },
            { 
                id: 3, 
                sku: "LIN-003", 
                name: "Belgian Linen", 
                category: "Linen", 
                price: 1850, 
                stock: 75, 
                unit: "metre", 
                fabricType: "European-grade Natural Linen",
                width: 58,
                gsm: 180,
                colorOptions: [
                    { colorLabel: "Natural", quantity: 40 },
                    { colorLabel: "White", quantity: 35 }
                ],
                stockHistory: [
                    { type: "added", quantity: 75, date: new Date(), reason: "Initial stock" }
                ],
                images: ["https://res.cloudinary.com/daugnr7ba/image/upload/v1/fabrics/belgian_linen_1.jpg"]
            },
            { 
                id: 4, 
                sku: "WOL-004", 
                name: "Merino Wool Twill", 
                category: "Wool", 
                price: 3200, 
                stock: 50, 
                unit: "metre", 
                fabricType: "Super-fine Merino Wool",
                width: 60,
                gsm: 280,
                colorOptions: [
                    { colorLabel: "Grey", quantity: 25 },
                    { colorLabel: "Navy", quantity: 25 }
                ],
                stockHistory: [
                    { type: "added", quantity: 50, date: new Date(), reason: "Initial stock" }
                ],
                images: ["https://res.cloudinary.com/daugnr7ba/image/upload/v1/fabrics/merino_wool_1.jpg"]
            },
            { 
                id: 5, 
                sku: "VEL-005", 
                name: "Crushed Velvet", 
                category: "Velvet", 
                price: 1600, 
                stock: 60, 
                unit: "metre", 
                fabricType: "Rich Crushed Velvet",
                width: 44,
                gsm: 350,
                colorOptions: [
                    { colorLabel: "Purple", quantity: 30 },
                    { colorLabel: "Red", quantity: 20 },
                    { colorLabel: "Black", quantity: 10 }
                ],
                stockHistory: [
                    { type: "added", quantity: 60, date: new Date(), reason: "Initial stock" }
                ],
                images: ["https://res.cloudinary.com/daugnr7ba/image/upload/v1/fabrics/crushed_velvet_1.jpg"]
            },
            { 
                id: 6, 
                sku: "BRO-006", 
                name: "Banarasi Brocade", 
                category: "Brocade", 
                price: 4800, 
                stock: 30, 
                unit: "metre", 
                fabricType: "Zari-interlaced Brocade",
                width: 44,
                gsm: 220,
                colorOptions: [
                    { colorLabel: "Gold", quantity: 15 },
                    { colorLabel: "Maroon", quantity: 15 }
                ],
                stockHistory: [
                    { type: "added", quantity: 30, date: new Date(), reason: "Initial stock" }
                ],
                images: ["https://res.cloudinary.com/daugnr7ba/image/upload/v1/fabrics/banarasi_brocade_1.jpg"]
            },
            { 
                id: 7, 
                sku: "SLK-007", 
                name: "Tussar Silk", 
                category: "Silk", 
                price: 1900, 
                stock: 80, 
                unit: "metre", 
                fabricType: "Wild-reared Tussar Silk",
                width: 44,
                gsm: 80,
                colorOptions: [
                    { colorLabel: "Golden", quantity: 40 },
                    { colorLabel: "Brown", quantity: 40 }
                ],
                stockHistory: [
                    { type: "added", quantity: 80, date: new Date(), reason: "Initial stock" }
                ],
                images: ["https://res.cloudinary.com/daugnr7ba/image/upload/v1/fabrics/tussar_silk_1.jpg"]
            },
            { 
                id: 8, 
                sku: "COT-008", 
                name: "Dobby Cotton Voile", 
                category: "Cotton", 
                price: 520, 
                stock: 120, 
                unit: "metre", 
                fabricType: "Dobby-weave Cotton Voile",
                width: 44,
                gsm: 45,
                colorOptions: [
                    { colorLabel: "White", quantity: 60 },
                    { colorLabel: "Cream", quantity: 60 }
                ],
                stockHistory: [
                    { type: "added", quantity: 120, date: new Date(), reason: "Initial stock" }
                ],
                images: ["https://res.cloudinary.com/daugnr7ba/image/upload/v1/fabrics/dobby_cotton_voile_1.jpg"]
            }
        ];
        
        await Product.insertMany(products);
        res.json({ message: 'Products initialized successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
