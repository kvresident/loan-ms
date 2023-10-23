const express = require('express')
const login = require('../controllers/login')
const router = express.Router();


router.get('/', (req, res) => {
    res.render('login');
})

router.get('/admin', (req, res) => {
    res.redirect('login')
})

router.post('/', login)

module.exports = router;