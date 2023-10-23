const express = require('express');
const { createLoanType } = require('../controllers/loan');

const router = express.Router();

router.post('/create-type', createLoanType)

module.exports = router;