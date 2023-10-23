const express = require('express');
const { home, agentDetails, viewAgentByUsername, setStatus } = require('../controllers/agent');
const { adminLoanContent } = require('../controllers/loan');

const router = express.Router();

router.get('/', (req, res)=>{
    res.render('dashboard')
})

router.get('/agents', home)

router.get('/agent', agentDetails);
router.get('/agent/:username', viewAgentByUsername);

router.get('/set-status', setStatus);
router.get('/loans', adminLoanContent)

module.exports = router;