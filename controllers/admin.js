const express = require('express');
const moment =  require('moment')

const Loan = require('../models/loan');
const Transaction = require('../models/transaction');
const Agent = require('../models/agent');
const Customer = require('../models/customer');
const Summary = require('../models/summary');

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
async function renderDashboard(req, res) {
  try {
    const overall = await Summary.findOne({ route: 'overall' });

    const date = new Date();

    const thisMonth = date.getMonth() + 1;



    const year = date.getFullYear();

    const monthsData = [];

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 1; i <= thisMonth; i++) {

      const monthData = await Summary.findOne({ route: `${year}/${i}` });

      if (monthData) {
        monthsData.push({
          data: monthData,
          month: months[i - 1]
        });
      } else {
        monthsData.push(
          {
            data: {
              "totalMoneyIn": 0,
              "totalMoneyOut": 0,
              "totalMoneyFlow": 0,
              "loansRequested": 0,
              "loansDisbursed": 0,
              "loansPayed": 0,
              "transactionAmountDeducted": 0,
              "profit": 0,
              "customers": 0
            },
            month: months[i - 1]
          })
      }

    }
    const yearMonth = `${year}/${date.getMonth() + 1}`;
    const yearMonthDay = `${yearMonth}/${date.getDate()}`;

    const newData = await Summary.findOne({ route: yearMonthDay });

    const agents = await Agent.find().sort({createdAt:-1}).limit(5).exec();
    const customers = await Customer.find().sort({createdAt: -1}).limit(5).exec();
    const loans =  await Loan.find().sort({createdAt: -1}).limit(5).exec();

    res.render('dashboard', {
      overall,
      monthsData,
      newData,
      agents,
      customers,
      loans,
      moment
    })
  } catch (error) {
    console.error(error);
    internalServerError(res);
  }
}

module.exports = { renderDashboard };