const LoanType = require('../models/loanType');
const Loan = require('../models/loan');
const express = require('express')

/**
 * 
 * @param {express.Response} res 
 * @returns 
*/
function internalServerError(res){
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
async function createLoanType(req, res){
    try {
        const loanType = new LoanType(req.body);

        await loanType.save();

        res.redirect('/admin/loans');
    } catch (error) {
        internalServerError(req)
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function adminLoanContent(req, res){
    try {
        const loans = await Loan.find();
        const loanTypes = await LoanType.find();

        res.render('admin-loan', {
            loans, loanTypes
        })
    } catch (error) {
        internalServerError(req);
    }
}

module.exports = {
    createLoanType, adminLoanContent
}