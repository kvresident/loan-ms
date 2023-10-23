const express = require('express');
const { createCustomer } = require('../controllers/customer');
const { activeAgentAuth } = require('../middleware/agentAuth');


const router = express.Router();

router.post('/create', activeAgentAuth, createCustomer);
router.get('/admin', (req, res)=>{

})

module.exports = router;