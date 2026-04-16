const mongoose = require('mongoose');
require('dotenv').config();

async function deepCheck() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB:', process.env.MONGODB_DB_NAME);
    
    const db = mongoose.connection.db;
    
    // Check all collections with different methods
    console.log('\n=== METHOD 1: listCollections() ===');
    const collections = await db.listCollections().toArray();
    collections.forEach(col => {
      console.log(`- ${col.name} (type: ${col.type})`);
    });
    
    console.log('\n=== METHOD 2: collections() ===');
    const collectionNames = await db.collections();
    collectionNames.forEach(col => {
      console.log(`- ${col.collectionName}`);
    });
    
    console.log('\n=== DETAILED PRODUCTS CHECK ===');
    
    // Method 1: Direct count
    const count1 = await db.collection('products').countDocuments();
    console.log(`Count method 1: ${count1}`);
    
    // Method 2: Estimated count
    const count2 = await db.collection('products').estimatedDocumentCount();
    console.log(`Estimated count: ${count2}`);
    
    // Method 3: Find with limit
    const products1 = await db.collection('products').find({}).limit(5).toArray();
    console.log(`Find method found: ${products1.length} products`);
    
    // Method 4: Aggregate
    const aggResult = await db.collection('products').aggregate([{$count: "total"}]).toArray();
    console.log(`Aggregate count: ${aggResult.length > 0 ? aggResult[0].total : 0}`);
    
    if (products1.length > 0) {
      console.log('\n=== SAMPLE PRODUCTS ===');
      products1.forEach((product, index) => {
        console.log(`\nProduct ${index + 1}:`);
        console.log(JSON.stringify(product, null, 2));
      });
    }
    
    // Check if there's a different products collection name
    console.log('\n=== CHECKING FOR ALTERNATE PRODUCT COLLECTIONS ===');
    const allCollections = await db.listCollections().toArray();
    const productRelated = allCollections.filter(col => 
      col.name.toLowerCase().includes('product')
    );
    console.log('Product-related collections:', productRelated.map(c => c.name));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

deepCheck();
