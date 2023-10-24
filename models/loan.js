const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer', // Reference to the Customer model
        required: true,
    },
    customerName: {
        type: String,
        required: true
    },
    dateOfInitiation: {
        type: Date,
        required: true,
        default: Date.now
    },
    amountRequested: {
        type: Number,
        required: true,
    },
    amountOffered: {
        type: Number
    },
    amountExpectedBack: {
        type: Number
    },
    amountPayed: {
        type: Number,
        default: 0
    },
    isAccepted: {
        type: Boolean
    },
    deadline: {
        type: Date,
        required: true,
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
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LoanType',
        required: true,
    },
    typeName: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Loan = mongoose.model('Loan', loanSchema);

module.exports = Loan;
