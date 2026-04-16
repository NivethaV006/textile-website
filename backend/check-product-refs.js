const mongoose = require('mongoose');
require('dotenv').config();

async function checkProductReferences() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Check product references in carts
    const carts = await mongoose.connection.db.collection('carts').find().toArray();
    console.log('\n=== PRODUCT REFERENCES IN CARTS ===');
    
    for (const cart of carts) {
      console.log(`\nCart ID: ${cart._id}`);
      for (const item of cart.items) {
        console.log(`  Product ID: ${item.product}`);
        console.log(`  Quantity: ${item.quantity}`);
        console.log(`  Price: ${item.price}`);
      }
    }
    
    // Check product references in orders
    const orders = await mongoose.connection.db.collection('orders').find().toArray();
    console.log('\n=== PRODUCT REFERENCES IN ORDERS ===');
    
    for (const order of orders) {
      console.log(`\nOrder ID: ${order._id}`);
      for (const item of order.items) {
        console.log(`  Product ID: ${item._id}`);
        console.log(`  Quantity: ${item.quantity}`);
        console.log(`  Price: ${item.price}`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkProductReferences();
