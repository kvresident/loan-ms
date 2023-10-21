const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer', // Reference to the Customer model
        required: true,
    },
    customerName: {
        type: String
    },
    dateOfInitiation: {
        type: Date,
        required: true,
    },
    amountRequested: {
        type: Number,
        required: true,
    },
    isAccepted: {
        type: Boolean
    },
    dateRequiredToComplete: {
        type: Date,
        required: true,
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
        required: true
    },
    reason: {
        type: String,
        default: 'No comment'
    },
    terms: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LoanTerm',
        required: true,
    },
}, { timestamps: true });

const Loan = mongoose.model('Loan', loanSchema);

module.exports = Loan;
