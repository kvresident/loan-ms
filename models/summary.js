const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
    summaryType: {
        type: String,
        enum: ['year', 'month', 'day', 'overall']
    },
    route: {
        type: String, // e.g., '2023', '2023/10', '2023/10/20', 'overall'
        required: true,
    },
    totalMoneyIn: {
        type: Number,
        default: 0,
    },
    totalMoneyOut: {
        type: Number,
        default: 0,
    },
    totalMoneyFlow: {
        type: Number,
        default: 0,
    },
    loansRequested: {
        type: Number,
        default: 0,
    },
    loansDisbursed: {
        type: Number,
        default: 0,
    },
    loansPayed: {
        type: Number,
        default: 0,
    },
    transactionAmountDeducted: {
        type: Number,
        default: 0,
    },
    profit: {
        type: Number,
        default: 0,
    },
    customers: {
        type: Number,
        default: 0
    }
});

summarySchema.pre('save', function (next) {

    this.profit = this.totalMoneyIn + this.transactionAmountDeducted - this.totalMoneyOut;
    this.totalMoneyFlow = this.totalMoneyIn + this.transactionAmountDeducted + this.totalMoneyOut;

    next();
});




const Summary = mongoose.model('Summary', summarySchema);

module.exports = Summary;

