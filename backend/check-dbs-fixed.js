const mongoose = require('mongoose');
require('dotenv').config');

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
          // Create new connection for each database
          const dbUri = process.env.MONGODB_URI.replace('/billing_custom_app', `/${dbInfo.name}`);
          const tempConnection = await mongoose.createConnection(dbUri);
          
          const collections = await tempConnection.db.listCollections().toArray();
          const hasProducts = collections.some(col => col.name === 'products');
          
          if (hasProducts) {
            const productCount = await tempConnection.db.collection('products').countDocuments();
            console.log(`✓ Found products collection with ${productCount} documents`);
            
            if (productCount > 0) {
              const sample = await tempConnection.db.collection('products').find().limit(1).toArray();
              console.log('Sample product:', JSON.stringify(sample[0], null, 2));
            }
          } else {
            console.log('✗ No products collection found');
          }
          
          await tempConnection.close();
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
