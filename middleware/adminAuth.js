const jwt = require('jsonwebtoken');

const adminKey = process.env.ADMIN_KEY;
const jwtSecret = process.env.JWT_SECRET;

const express = require('express');

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function auth(req, res, next) {
    const errorObject = {
        status: 401,
        reason: 'Access Denied',
        message: `Not cleared to be view this page`,
        link: '/login/admin',
        linkMessage: 'GO TO LOGIN'
    }
    const token = req.session.admin;

    if (!token) {
        return res.render('error', errorObject);
    }

    const decoded = jwt.verify(token, jwtSecret);
    console.log(decoded);
    if(!decoded){
        return res.render('error', errorObject);
    }

    if(decoded.key == adminKey){
        next();
    }else{
        return res.render('error', errorObject);
    }
}

module.exports = auth;