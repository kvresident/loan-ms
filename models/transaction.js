const mongoose = require('mongoose');
const Summary = require('./summary');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['disbursement', 'loan-repayment', 'expense']
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
  confirmation: {
    type: String
  }
}, { timestamps: true });


transactionSchema.pre('save', async function (next) {
  try {
    // Get the transaction date from the createdAt property
    const transactionDate = new Date();

    // Create an array of summaries to update
    const summariesToUpdate = [
      { summaryType: 'overall', route: 'overall' },
      { summaryType: 'year', route: transactionDate.getFullYear() },
      { summaryType: 'month', route: `${transactionDate.getFullYear()}/${transactionDate.getMonth() + 1}` },
      { summaryType: 'day', route: `${transactionDate.getFullYear()}/${transactionDate.getMonth() + 1}/${transactionDate.getDate()}` },
    ];

    // Loop through summaries and update them
    for (const summaryData of summariesToUpdate) {
      let summary = await Summary.findOne(summaryData);

      if (!summary) {
        summary = new Summary(summaryData);
      }

      if (this.type === 'disbursement' || this.type === 'expense') {
        // Increase 'totalMoneyOut' for disbursement or expense
        summary.totalMoneyOut += this.amount;
      } 
      if (this.type === 'loan-repayment') {
        // Increase 'totalMoneyIn' for loan repayment
        summary.totalMoneyIn += this.amount;
      }

      if (this.cost !== 0) {
        // Increase 'transactionAmountDeducted' for non-zero cost
        summary.transactionAmountDeducted += this.cost;
      }

      // Save the updated summary
      await summary.save();
    }

    next();
  } catch (error) {
    next(error);
  }
});



const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
