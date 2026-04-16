const mongoose = require('mongoose');
require('dotenv').config();

async function verifyConnection() {
  try {
    console.log('=== CONNECTION VERIFICATION ===');
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    console.log('DB_NAME:', process.env.MONGODB_DB_NAME);
    
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Get actual database name from connection
    const actualDbName = mongoose.connection.name;
    console.log('Actual connected database:', actualDbName);
    
    // Check if we're connecting to the right place
    if (actualDbName !== process.env.MONGODB_DB_NAME) {
      console.log('⚠️  DATABASE NAME MISMATCH!');
      console.log('Expected:', process.env.MONGODB_DB_NAME);
      console.log('Actual:', actualDbName);
    }
    
    // Force check products collection with raw MongoDB driver
    const db = mongoose.connection.db;
    console.log('Database object name:', db.databaseName);
    
    // Try different methods to find products
    console.log('\n=== FORCE CHECK PRODUCTS ===');
    
    try {
      const rawCount = await db.collection('products').countDocuments();
      console.log('Raw count:', rawCount);
    } catch (err) {
      console.log('Raw count error:', err.message);
    }
    
    // Try with aggregation
    try {
      const aggResult = await db.collection('products').aggregate([{$count: "total"}]).toArray();
      console.log('Aggregation result:', aggResult);
    } catch (err) {
      console.log('Aggregation error:', err.message);
    }
    
    // List all collections again to be sure
    const collections = await db.listCollections().toArray();
    console.log('\nAll collections in', actualDbName + ':');
    collections.forEach(col => {
      console.log(`- ${col.name}`);
    });
    
    // Maybe the collection has a different case or name
    const possibleNames = ['products', 'Products', 'PRODUCTS', 'product', 'Product'];
    console.log('\n=== CHECKING POSSIBLE COLLECTION NAMES ===');
    
    for (const name of possibleNames) {
      try {
        const count = await db.collection(name).countDocuments();
        if (count > 0) {
          console.log(`✓ Found ${count} documents in '${name}' collection`);
          const sample = await db.collection(name).findOne();
          console.log('Sample:', JSON.stringify(sample, null, 2));
        }
      } catch (err) {
        // Collection doesn't exist, that's fine
      }
    }
    
  } catch (error) {
    console.error('Connection error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

verifyConnection();
