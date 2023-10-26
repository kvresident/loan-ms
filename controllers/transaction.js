const Transaction = require('../models/transaction');
const Customer = require('../models/customer');
const Loan = require('../models/loan');
const LoanType = require('../models/loanType');
const Agent = require('../models/agent');

const express = require('express');
const moment = require('moment');

/**
 * 
 * @param {express.Response} res 
 * @returns 
 */
function internalServerError(res) {
    return res.render('error', {
        status: 500,
        reason: 'An Error Occurred',
        message: `An error occurred on our side. If this error persists contact the admin`,
        link: '/agent/customers',
        linkMessage: 'BACK TO HOME'
    })
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function disburseLoanPage(req, res) {
    try {
        const loan = await Loan.findById(req.query.id);
        const loanType = await LoanType.findById(loan.type);
        const customer = await Customer.findById(loan.customer);


        res.render('disburse-loan', {
            customer,
            loanType,
            loan,
            moment
        })
    } catch (error) {
        internalServerError(res);
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function payLoanPage(req, res) {
    try {
        const loan = await Loan.findById(req.query.id);
        const loanType = await LoanType.findById(loan.type);
        const customer = await Customer.findById(loan.customer);

        res.render('pay-loan', {
            name: req.session.agentData.name,
            customer,
            loanType,
            loan,
            moment
        })
    } catch (error) {
        console.log(error);
        internalServerError(res);
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function disburseLoan(req, res) {
    try {
        console.log(req.body);
        const loan = await Loan.findById(req.body.loan);
        const loanType = await LoanType.findById(loan.type);
        const transaction = new Transaction({
            type: 'disbursement',
            amount: req.body.amountDisbursed,
            description: `Disbursement of loan`,
            cost: req.body.amountDisbursed / 20,
            confirmation: req.body.confirmation
        });

        await transaction.save();

        loan.amountOffered = req.body.amountDisbursed;
        loan.amountExpectedBack = req.body.amountDisbursed * (1 + (loanType.rate / 100));
        loan.isAccepted = true;
        loan.deadline = new Date(req.body.deadline);
        loan.transactions.push(transaction._id);
        loan.dateOfDisbursement = new Date();
        await loan.save();

        res.redirect('/admin/loans');
    } catch (error) {
        console.log(error);
        internalServerError(res);
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function payLoan(req, res) {
    try {
        const { amount, loan: loanId, confirmation } = req.body;

        const loan = await Loan.findById(loanId);

        const transaction = new Transaction({
            type: 'loan-repayment',
            amount,
            description: `loan repayment`,
            cost: 0,
            confirmation
        });

        await transaction.save();


        loan.transactions.push(transaction._id);
        loan.amountPayed += amount;

        await loan.save();

        res.redirect('/agent/loans')
    } catch (error) {
        console.log(error);
        internalServerError(res);
    }
}

module.exports = {
    disburseLoanPage, disburseLoan, payLoanPage, payLoan
}