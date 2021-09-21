const mongoose = require('mongoose');
const config = require('config');

const db = config.get('mongoURI');

const connectDb = async () => {
  try {
    await mongoose.connect(db);
    console.log('DATABASE CONNECTED 😇');
  } catch (err) {
    console.log(err.message);
    // exit process with fail status
    process.exit(1);
  }
};

module.exports = connectDb;
