const mongoose = require('mongoose');

const loanTypeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  minAmount: {
    type: Number,
    required: true,
  },
  maxAmount: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
}, {timestamps: true});

const LoanType = mongoose.model('LoanType', loanTypeSchema);

module.exports = LoanType;