const mongoose = require('mongoose');
require('dotenv').config();

async function checkImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const products = await mongoose.connection.db.collection('products').find({}).limit(3).toArray();
    
    products.forEach((p, i) => {
      console.log(`Product ${i+1}:`);
      console.log('Name:', p.name);
      console.log('Image field:', p.image);
      console.log('Images array:', p.images);
      console.log('First image:', p.images?.[0]);
      console.log('---');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkImages();
