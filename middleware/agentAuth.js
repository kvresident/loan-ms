const jwt = require('jsonwebtoken');
const Agent = require('../models/agent');

const jwtSecret = process.env.JWT_SECRET;

const express = require('express');

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
async function activeAgentAuth(req, res, next) {
    try {
        const errorObject = {
            status: 401,
            reason: 'Login Required',
            message: `You need to login to view this page, kindly do that`,
            link: '/login',
            linkMessage: 'GO TO LOGIN'
        }
        const token = req.session.agent;

        if (!token) {
            return res.render('error', errorObject);
        }

        const decoded = jwt.verify(token, jwtSecret);
        console.log(decoded);
        if (!decoded || !decoded.id) {
            return res.render('error', errorObject);
        }

        const agent = await Agent.findById(decoded.id)

        if (!agent) {
            return res.render('error', errorObject);
        }
        if (agent.status == 'pending') {
            return res.render('error', {
                status: 401,
                reason: `Activation Required`,
                message: `Your account is not activated, Change the password and to activate your account`,
                link: '/login',
                linkMessage: 'TRY ANOTHER ACCOUNT'
            });
        }
        if (agent.status != 'active') {
            return res.render('error', {
                status: 401,
                reason: `Account ${agent.status}`,
                message: `Your account is currently ${agent.status}, you wont be able to access this page until your account is active again`,
                link: '/login',
                linkMessage: 'TRY ANOTHER ACCOUNT'
            });
        }
        req.session.agentData = agent;
        next();
    } catch (error) {
        res.render('error', {
            status: 500,
            reason: `Authentication Error`,
            message: `An error occurred while verifying your account, try again later`,
            link: '/login',
            linkMessage: 'GO TO LOGIN'
        });
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
async function agentExistsAuth(req, res, next) {
    try {
        const errorObject = {
            status: 401,
            reason: 'Login Required',
            message: `You need to login to view this page, kindly do that`,
            link: '/login',
            linkMessage: 'GO TO LOGIN'
        }
        const token = req.session.agent;

        if (!token) {
            return res.render('error', errorObject);
        }

        const decoded = jwt.verify(token, jwtSecret);
        if (!decoded || !decoded.id) {
            return res.render('error', errorObject);
        }

        const agent = await Agent.findById(decoded.id)

        if (!agent) {
            return res.render('error', errorObject);
        }

        req.session.agentData = agent;
        next();
    } catch (error) {
        res.render('error', {
            status: 500,
            reason: `Authentication Error`,
            message: `An error occurred while verifying your account, try again later`,
            link: '/login',
            linkMessage: 'GO TO LOGIN'
        });
    }
}

module.exports = {
    activeAgentAuth, agentExistsAuth
};