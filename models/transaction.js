const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String, 
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: String,
  cost: {
    type: Number,
    default: 0
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent'
  },
  confirmation:{
    type: String
  }
}, {timestamps: true});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
