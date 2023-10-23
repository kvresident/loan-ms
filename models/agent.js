const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: [
      'pending', 'terminated', 'suspended', 'active'
    ],
    default: 'pending'
  },
}, { timestamps: true });

const Agent = mongoose.model('Agent', agentSchema);

module.exports = Agent;
