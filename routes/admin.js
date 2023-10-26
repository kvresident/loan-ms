const express = require('express');
const { home, agentDetails, viewAgentByUsername, setStatus } = require('../controllers/agent');
const { adminLoanContent, adminDeleteLoan } = require('../controllers/loan');
const { adminCustomersPage, adminCustomerPage } = require('../controllers/customer');
const { disburseLoanPage, disburseLoan } = require('../controllers/transaction');

const router = express.Router();

router.get('/', (req, res)=>{
    res.render('dashboard')
})

router.get('/agents', home)

router.get('/agent', agentDetails);
router.get('/agent/:username', viewAgentByUsername);

router.get('/set-status', setStatus);
router.get('/loans', adminLoanContent)
router.get('/delete-loan', adminDeleteLoan);

router.get('/customers', adminCustomersPage);

router.get('/customer-info', adminCustomerPage);

router.get('/accept-loan', disburseLoanPage);

router.post('/disburse', disburseLoan);

module.exports = router;