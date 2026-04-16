const mongoose = require('mongoose');
require('dotenv').config();

async function checkDatabases() {
  try {
    // Check billing_custom_app (current)
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('=== BILLING_CUSTOM_APP ===');
    const count = await mongoose.connection.db.collection('products').countDocuments();
    console.log(`Products count: ${count}`);
    
    // Check test database
    await mongoose.disconnect();
    const testUri = process.env.MONGODB_URI.replace('/billing_custom_app', '/test');
    await mongoose.connect(testUri);
    console.log('\n=== TEST DATABASE ===');
    try {
      const testCount = await mongoose.connection.db.collection('products').countDocuments();
      console.log(`Products count: ${testCount}`);
      if (testCount > 0) {
        const sample = await mongoose.connection.db.collection('products').find().limit(1).toArray();
        console.log('Sample:', JSON.stringify(sample[0], null, 2));
      }
    } catch (err) {
      console.log('No products collection or error:', err.message);
    }
    
    // Check sample_mflix database
    await mongoose.disconnect();
    const mflixUri = process.env.MONGODB_URI.replace('/billing_custom_app', '/sample_mflix');
    await mongoose.connect(mflixUri);
    console.log('\n=== SAMPLE_MFLIX DATABASE ===');
    try {
      const mflixCount = await mongoose.connection.db.collection('products').countDocuments();
      console.log(`Products count: ${mflixCount}`);
      if (mflixCount > 0) {
        const sample = await mongoose.connection.db.collection('products').find().limit(1).toArray();
        console.log('Sample:', JSON.stringify(sample[0], null, 2));
      }
    } catch (err) {
      console.log('No products collection or error:', err.message);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkDatabases();
