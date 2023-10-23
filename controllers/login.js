const Agent = require('../models/agent');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const express = require('express')

const adminPwd = process.env.password;

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns 
 */
async function adminLogin(req, res) {
    const pwdOk = bcrypt.compareSync(req.body.password, adminPwd);

    if (pwdOk) {
        req.session.admin = jwt.sign({
            id: '0x001',
            key: process.env.ADMIN_KEY,
            role: 'Admin'
        }, process.env.JWT_SECRET);
        res.redirect('/admin');
    } else {
        return res.render("error", {
            status: 401,
            reason: 'Access Denied',
            message: `Wrong Password`,
            link: '/login',
            linkMessage: 'Try Again'
        })
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {Agent} agent
 * @returns 
 */
function agentLogin(req, res, agent) {
    if (!agent) {
        return res.render("error", {
            status: 404,
            reason: 'Account not found',
            message: `Check the account credentials and try again`,
            link: '/login',
            linkMessage: 'Try Again'
        })
    }

    if (agent.status == 'pending') {
        return res.redirect('/agent/set-pwd?agent=' + agent.username);
    }

    if (agent.status != 'active') {
        return res.render("error", {
            status: 401,
            reason: 'Access Denied',
            message: `Your account is currently ${agent.status}, try again with another account`,
            link: '/login',
            linkMessage: 'Try Again'
        })
    }

    const pwd = req.body.password;

    const pwdOk = bcrypt.compareSync(pwd, agent.password);

    if (pwdOk) {
        req.session.agent = jwt.sign({
            id: agent._id,
            email: agent.email,
            phone: agent.phone,
            role: 'Agent'
        }, process.env.JWT_SECRET);
        res.redirect('/agent');
    } else {
        return res.render("error", {
            status: 401,
            reason: 'Access Denied',
            message: `Wrong Password`,
            link: '/login',
            linkMessage: 'Try Again'
        })
    }

}


/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns 
 */
async function chooseLoginOption(req, res, username){
    try {
        const usernameAgent = await Agent.findOne({username});

        if(usernameAgent){
            return agentLogin(req, res, usernameAgent);
        }

        const emailAgent = await Agent.findOne({email: username});

        if(emailAgent){
            return agentLogin(req, res, emailAgent)
        }

        const phoneAgent = await Agent.findOne({phone: username});

        if(phoneAgent){
            return agentLogin(req, res, phoneAgent);
        }

        return res.render("error", {
            status: 404,
            reason: 'Account not found',
            message: `Check the account credentials and try again`,
            link: '/login',
            linkMessage: 'Try Again'
        })
    } catch (error) {
        throw error;
    }
}


/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns 
 */
async function login(req, res) {
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
            return adminLogin(req, res);
        }

        chooseLoginOption(req, res, username);
    } catch (error) {
        res.render("error", {
            status: 500,
            reason: 'Internal Server Error',
            message: `An error occurred, try again latter or contact the admin`,
            link: '/',
            linkMessage: 'Back Home'
        })
    }
}

module.exports = login;