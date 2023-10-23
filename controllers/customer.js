const express = require('express');

const Customer = require('../models/customer');

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
async function createCustomer(req, res){
    try {
        const customer = new Customer({
            ...req.body,
            agent: req.session.agentData._id
        });

        await customer.save();
        res.redirect('/agent/customers');
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
async function agentCustomersPage(req, res){
    try {
        let agent = req.session.agentData;
        const customers = await Customer.find();
        let index = 1;
        res.render('agent-customers', {...agent,
            name: agent.name, 
            customers: customers.map(({name, phone, nationalIdNumber, _id})=>{
            return {
                name, phone, nationalIdNumber, _id,
                index: index++
            }
        })});
    } catch (error) {
        console.log(error)
        internalServerError(res);
    }
}

module.exports = {
    createCustomer, agentCustomersPage
}