require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

// Environment variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blueprint';

// Connect to MongoDB using Mongoose
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB');
    
    // Start Express server only after DB is connected
    app.listen(PORT, () => {
      console.log(`🚀 BluePrint Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });
