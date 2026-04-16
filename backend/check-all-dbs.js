const mongoose = require('mongoose');
require('dotenv').config();

async function checkAllDatabases() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB cluster');
    
    // List all databases
    const admin = mongoose.connection.db.admin();
    const databases = await admin.listDatabases();
    
    console.log('\n=== ALL DATABASES ON CLUSTER ===');
    databases.databases.forEach(db => {
      console.log(`- ${db.name} (size: ${db.sizeOnDisk})`);
    });
    
    // Check each database for products
    for (const dbInfo of databases.databases) {
      if (dbInfo.name !== 'admin' && dbInfo.name !== 'config' && dbInfo.name !== 'local') {
        console.log(`\n=== CHECKING ${dbInfo.name.toUpperCase()} FOR PRODUCTS ===`);
        try {
          const testDb = mongoose.connection.useDb(dbInfo.name);
          const collections = await testDb.listCollections().toArray();
          const hasProducts = collections.some(col => col.name === 'products');
          
          if (hasProducts) {
            const productCount = await testDb.collection('products').countDocuments();
            console.log(`✓ Found products collection with ${productCount} documents`);
            
            if (productCount > 0) {
              const sample = await testDb.collection('products').find().limit(1).toArray();
              console.log('Sample product:', JSON.stringify(sample[0], null, 2));
            }
          } else {
            console.log('✗ No products collection found');
          }
        } catch (err) {
          console.log(`Error accessing ${dbInfo.name}: ${err.message}`);
        }
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkAllDatabases();
