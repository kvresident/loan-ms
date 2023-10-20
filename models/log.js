const mongoose = require('mongoose');

// Define a schema for log entries
const logSchema = new mongoose.Schema({
  method: String,
  url: String,
  status: Number,
  timestamp: Date,
  responseTime: Number,
  sessionId: String,
  ip: String,
  os: String,
  device: String,
  client: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: String,
    default: null
  }
});

// Create a Mongoose model based on the schema
const Log = mongoose.model('Log', logSchema);

module.exports = Log;
