const Agent = require('../models/agent');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const express = require('express')

const router = express.Router();

const adminPwd = process.env.password;

router.get('/', (req, res) => {
    res.render('login');
})

router.get('/admin', (req, res) => {
    res.render('loginAdmin')
})

router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username) {
            return res.render("error", {
                status: 422,
                reason: 'Missing username',
                message: `Ensure that you have included the username, if the error persists, contact the developers`,
                link: '/login',
                linkMessage: 'Try Again'
            })
        }

        if (!password) {
            return res.render("error", {
                status: 422,
                reason: 'Missing password',
                message: `Ensure that you have included the password, if the error persists, contact the developers`,
                link: '/login',
                linkMessage: 'Try Again'
            })
        }

        if (['Admin', 'admin', 'administrator', 'ADMIN'].includes(username)) {
            const pwdOk = bcrypt.compareSync(password, adminPwd);

            if (pwdOk) {
                req.session.admin = jwt.sign({
                    id: '0x001',
                    key: process.env.ADMIN_KEY,
                    role: 'Admin'
                }, process.env.JWT_SECRET);
                res.redirect('/');
            }else{
                return res.render("error", {
                    status: 401,
                    reason: 'Access Denied',
                    message: `Wrong Password`,
                    link: '/login',
                    linkMessage: 'Try Again'
                })
            }
        }
    } catch (error) {
        res.render("error", {
            status: 500,
            reason: 'Internal Server Error',
            message: `An error occurred, try again latter or contact the admin`,
            link: '/',
            linkMessage: 'Back Home'
        })
    }
})

module.exports = router;