const LoanType = require('../models/loanType');
const Loan = require('../models/loan');
const express = require('express');
const Customer = require('../models/customer');
const moment = require('moment')

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
        const loans = await Loan.find().sort({ createdAt: -1 });
        const loanTypes = await LoanType.find().sort({createdAt: -1});

        res.render('admin-loan', {
            loans, loanTypes, moment
        })
    } catch (error) {
        internalServerError(req);
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function agentLoanContent(req, res){
    try {
        let agent = req.session.agentData;
        const loanTypes = await LoanType.find();
        const customers = await Customer.find();
        const loans = await Loan.find({uploadedBy: agent._id});
        
        res.render('agent-loan', {loanTypes, customers, loans, name: agent.name, moment})
    } catch (error) {
        console.log(error)
        internalServerError(res);
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function createLoan(req, res){
    try {
       const customer = await Customer.findById(req.body.customer);
       const loanType = await LoanType.findById(req.body.loanType);
       let agent = req.session.agentData;
        console.log(req.body)
       const loan = new Loan({
        customer: customer._id,
        customerName: customer.name,
        dateOfInitiation: new Date(),
        amountRequested: req.body.amountRequested,
        uploadedBy: agent._id,
        type: loanType._id,
        typeName: loanType.title,
        deadline: req.body.deadline,
        reason: req.body.reason
       })

       await loan.save();

       res.redirect('/agent/loans');
    } catch (error) {
        console.log(error)
        internalServerError(res);
    }
}


/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function agentDeleteLoan(req, res){
    try {
        const agent = req.session.agentData;

        await Loan.findOneAndDelete({_id:req.query.id, uploadedBy: agent._id});

        res.redirect('/agent/loans')
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
async function adminDeleteLoan(req, res){
    try {
        await Loan.findByIdAndDelete(req.query.id);
        res.redirect('/admin/loans')
    } catch (error) {
        console.log(error);
        internalServerError(res);
    }
}

module.exports = {
    createLoanType, adminLoanContent, agentLoanContent, createLoan, agentDeleteLoan, adminDeleteLoan
}