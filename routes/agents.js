const express = require('express');
const { create, setPwd, agentDashboard } = require('../controllers/agent');
const adminAuth = require('../middleware/adminAuth');
const { agentExistsAuth, activeAgentAuth } = require('../middleware/agentAuth');
const { agentCustomersPage } = require('../controllers/customer');
const { agentLoanContent } = require('../controllers/loan');

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



module.exports = router;