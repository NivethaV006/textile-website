# SRI MURUGAN TEX Backend

Backend server for SRI MURUGAN TEX e-commerce website.

## Features

- **Product Management**: CRUD operations for products
- **Cart Management**: Persistent cart storage in MongoDB
- **User Authentication**: Login and registration with JWT
- **Order Processing**: Order creation and management
- **Payment Integration**: Razorpay payment gateway ready

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:productId` - Update cart item quantity
- `DELETE /api/cart/:productId` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with:
```
MONGODB_URI=mongodb+srv://bala:bala123@cluster0.6vcre35.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_jwt_secret_key_heresecretkeythatnobodyknows
PORT=3001
```

3. Start development server:
```bash
npm run dev
```

4. Start production server:
```bash
npm start
```

## Database

Uses MongoDB Atlas for data storage with the following collections:
- `products` - Product information
- `users` - User accounts
- `cart` - Shopping cart data
- `orders` - Order information

## Security

- Password hashing with bcryptjs
- JWT token authentication
- CORS enabled for frontend
- Input validation and sanitization
