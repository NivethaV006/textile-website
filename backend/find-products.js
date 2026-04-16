const mongoose = require('mongoose');
require('dotenv').config();

async function findProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to:', process.env.MONGODB_DB_NAME);
    
    const db = mongoose.connection.db;
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log('\nAll collections:', collections.map(c => c.name));
    
    // Check each collection for product-like documents
    for (const collection of collections) {
      console.log(`\n=== Checking ${collection.name.toUpperCase()} ===`);
      try {
        const count = await db.collection(collection.name).countDocuments();
        console.log(`Document count: ${count}`);
        
        if (count > 0) {
          // Get a sample document
          const sample = await db.collection(collection.name).findOne();
          console.log('Sample document keys:', Object.keys(sample));
          
          // Check if it looks like a product
          const hasProductFields = ['name', 'price', 'category'].some(key => key in sample);
          if (hasProductFields) {
            console.log('✓ This looks like a product collection!');
            console.log('Sample:', JSON.stringify(sample, null, 2));
          }
        }
      } catch (err) {
        console.log('Error:', err.message);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

findProducts();
