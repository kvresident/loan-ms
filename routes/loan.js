const express = require('express');
const { createLoanType, createLoan } = require('../controllers/loan');
const { activeAgentAuth } = require('../middleware/agentAuth');

const router = express.Router();

router.post('/create-type', createLoanType)

router.post('/create', activeAgentAuth, createLoan);

module.exports = router;