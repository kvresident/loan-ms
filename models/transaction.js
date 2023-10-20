const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String, // 'Expense', 'Income', or other transaction types
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: String,
  date: {
    type: Date,
    required: true,
  },
  message: {
    type: String
  },
  cost: {
    type: Number,
    default: 0
  }
}, {timestamps: true});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
