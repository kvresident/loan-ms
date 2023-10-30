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
    dateOfDisbursement: {
        type: Date
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
        type: Boolean,
        default: false
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
    },
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    }],
    status: {
        type: String,
        enum: ['pending', 'disbursed', 'payed'],
        default: 'pending',
    },
}, { timestamps: true });

// Import the Summary model
const Summary = require('./summary'); // Adjust the import path as needed

// Define pre-save middleware to update summaries
loanSchema.pre('save', async function (next) {
    try {

        if (this.isModified('status')) {
            if (
                (this.status === 'pending' && this._previousStatus === 'disbursed') ||
                (this.status === 'pending' && this._previousStatus === 'payed')
            ) {
                return next(new Error("Status cannot transition from 'disbursed' or 'payed' to 'pending'"));
            }
            if (this.status === 'disbursed') {
                // Loan disbursement
                await updateSummaries(this, 1, 'loanDisbursement');
            } else if (this.status === 'payed') {
                // Loan payment
                await updateSummaries(this, 1, 'loanPayment');
            }
        }

        if (this.isNew) {
            // New loan creation
            await updateSummaries(this, 1, 'loanCreation');
        } 
        
        next();
    } catch (error) {
        next(error);
    }
});

async function updateSummaries(loan, increment, operationType) {
    const year = loan.dateOfInitiation.getFullYear();
    const yearMonth = `${year}/${loan.dateOfInitiation.getMonth() + 1}`;
    const yearMonthDay = `${year}/${loan.dateOfInitiation.getMonth() + 1}/${loan.dateOfInitiation.getDate()}`;

    // Define the summaries to update
    const summariesToUpdate = [
        { summaryType: 'overall', route: 'overall' },
        { summaryType: 'year', route: year },
        { summaryType: 'month', route: yearMonth },
        { summaryType: 'day', route: yearMonthDay },
    ];

    const summaryUpdates = [];

    for (const summaryData of summariesToUpdate) {
        let summary = await Summary.findOne(summaryData);

        if (!summary) {
            summary = new Summary(summaryData);
        }

        if (operationType === 'loanCreation') {
            summary.loansRequested += increment;
        } else if (operationType === 'loanDisbursement') {
            summary.loansDisbursed += increment;
        } else if (operationType === 'loanPayment') {
            if (loan.status === 'payed') {
                summary.loansPayed += increment;
            }
        }

        summaryUpdates.push(summary.save());
    }

    await Promise.all(summaryUpdates); // Wait for all summaries to be saved
}


const Loan = mongoose.model('Loan', loanSchema);





module.exports = Loan;
