const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');

async function clearProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const count = await Product.countDocuments();
    console.log(`Current product count: ${count}`);
    
    if (count > 0) {
      await Product.deleteMany({});
      console.log('All products cleared from database');
    }
    
    const newCount = await Product.countDocuments();
    console.log(`Product count after clearing: ${newCount}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

clearProducts();
