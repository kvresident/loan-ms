const express = require(express);
const Loan =require('../models/loan');
const Transaction = require('../models/transaction');


/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function total(req, res) {
    try {
      const loans = await Loan.find();
      const transactions = Transaction.find();

      const totalRequested = loans.reduce((a, d)=>a+d.amountRequested, 0);

      
    } catch (error) {
      console.error('Error calculating total amount requested:', error);
      res.status(500).send('Internal Server Error');
    }
  }
  