const express = require('express');
const { create, setPwd, agentDashboard } = require('../controllers/agent');
const adminAuth = require('../middleware/adminAuth');
const { agentExistsAuth, activeAgentAuth } = require('../middleware/agentAuth');
const { agentCustomersPage, agentCustomerPage } = require('../controllers/customer');
const { agentLoanContent, agentDeleteLoan } = require('../controllers/loan');
const { payLoanPage, payLoan } = require('../controllers/transaction');

const router = express.Router();

router.get('/', agentExistsAuth, agentDashboard);
router.get('/customers', activeAgentAuth, agentCustomersPage)
router.post('/register', adminAuth, create);

router.post('/set-pwd', setPwd);

router.get('/set-pwd', (req, res)=>{
    const agent = req.query.agent;

    res.render('setPwd', {username: agent})
});

router.get('/loans', activeAgentAuth, agentLoanContent)

router.get('/settings', agentExistsAuth, (req, res)=>{
    res.render('agent-settings', {name: req.session.agentData.name});
})

router.get('/delete-loan', activeAgentAuth, agentDeleteLoan);

router.get('/customer/info', agentExistsAuth, agentCustomerPage);

router.post('/pay-loan', activeAgentAuth, payLoan);

router.get('/pay-loan', activeAgentAuth, payLoanPage);

module.exports = router;