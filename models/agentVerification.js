const mongoose = require('mongoose');

const agentVerificationSchema = new mongoose.Schema({
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent', // Reference to the Agent model
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false, // Agents are not verified by default
  },
  verificationCode: {
    type: String,
    required: true,
  },
  verificationMessage: {
    type: String,
    required: true
  },
}, {timestamps: true});

const AgentVerification = mongoose.model('AgentVerification', agentVerificationSchema);

module.exports = AgentVerification;
