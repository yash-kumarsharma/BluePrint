require('dotenv').config();
const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

// Disable IPv6 resolution globally (including on Resolver class instances used by Nodemailer)
const disableResolve6 = () => {
  return function (hostname, options, callback) {
    const cb = typeof options === 'function' ? options : callback;
    if (cb) {
      return cb(null, []);
    }
  };
};

if (typeof dns.resolve6 === 'function') {
  dns.resolve6 = disableResolve6();
}

if (dns.Resolver && dns.Resolver.prototype) {
  dns.Resolver.prototype.resolve6 = disableResolve6();
}

if (dns.promises) {
  if (typeof dns.promises.resolve6 === 'function') {
    dns.promises.resolve6 = async () => [];
  }
  if (dns.promises.Resolver && dns.promises.Resolver.prototype) {
    dns.promises.Resolver.prototype.resolve6 = async () => [];
  }
}

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
