const mongoose = require('mongoose');
require('dotenv').config();

async function checkDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB:', process.env.MONGODB_DB_NAME);
    
    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n=== COLLECTIONS FOUND ===');
    collections.forEach(col => {
      console.log(`- ${col.name}`);
    });
    
    // Check data in each collection
    for (const collection of collections) {
      const count = await mongoose.connection.db.collection(collection.name).countDocuments();
      console.log(`\n=== ${collection.name.toUpperCase()} (${count} documents) ===`);
      
      if (count > 0) {
        const samples = await mongoose.connection.db.collection(collection.name).find().limit(3).toArray();
        samples.forEach((doc, index) => {
          console.log(`Document ${index + 1}:`, JSON.stringify(doc, null, 2));
        });
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkDatabase();
