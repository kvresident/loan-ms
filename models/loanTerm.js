const mongoose = require('mongoose');

const loanTermSchema = new mongoose.Schema({
  name: {
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
});

const LoanTerm = mongoose.model('LoanTerm', loanTermSchema);

module.exports = LoanTerm;
