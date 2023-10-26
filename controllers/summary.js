const Summary = require('../models/summary');
const Transaction = require('../models/transaction');
const moment = require('moment');
const Loan = require('../models/loan');



const update = {
    today: async () => {
        const date = new Date();
        const today = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

        const existingSummary = await Summary.findOne({ route: today });
        const summary = existingSummary ? existingSummary : new Summary({
            route: today, type: 'day'
        });
        date.setHours(0, 0, 0);
        const transactions = await Transaction.find({
            createdAt: {
                $gte: date
            }
        });

        var totalMoneyIn = 0;
        var totalMoneyOut = 0;
        var loansDistributed = 0;
        var loansPayed = 0;
        transactions.forEach(d => {
            if (d.type == 'disbursement') {
                totalMoneyOut += d.amount;
                loansDistributed++;
            } else {
                totalMoneyIn += d.amount;
                loansPayed++;
            }
        })
        const totalMoneyFlow = totalMoneyIn + totalMoneyOut;

        const loans = await Loan.find({
            createdAt: {
                $gte: today
            }
        });
        
        loans.forEach(loan=>{
            
        })

    }
}