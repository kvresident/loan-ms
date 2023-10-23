const Agent = require('../models/agent');
const moment = require('moment')
const express = require("express");
const bcrypt = require('bcrypt')

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function create(req, res) {
    try {
        const {
            name, email, password, username, phone
        } = req.body;

        for (let e of ['name', 'email', 'password', 'username', 'phone']) {
            if (!req.body[e]) {
                return res.render('error', {
                    status: 422,
                    reason: 'Missing ' + e,
                    message: `You must include ${e} in your request. If this error persists contact the admin`,
                    link: '/register',
                    linkMessage: 'Try Again'
                })
            }
        }

        const usernameExist = await Agent.findOne({ username })

        if (usernameExist) {
            return res.render('error', {
                status: 422,
                reason: 'Username already Exist',
                message: `The username ${usernameExist.username} has already been used by agent ${usernameExist.name}`,
                link: '/register',
                linkMessage: 'Try Again'
            })
        }

        const emailExist = await Agent.findOne({ email });
        if (emailExist) {
            return res.render('error', {
                status: 422,
                reason: 'Username already Exist',
                message: `The Email ${email} has already been used by agent ${emailExist.name} of ${emailExist.email} `,
                link: '/register',
                linkMessage: 'Try Again'
            })
        }

        const phoneExist = await Agent.findOne({ email });
        if (phoneExist) {
            return res.render('error', {
                status: 422,
                reason: 'Username already Exist',
                message: `The phone ${phone} has already been used by agent ${phoneExist.name} of ${phoneExist.phone}`,
                link: '/register',
                linkMessage: 'Try Again'
            })
        }


        const agent = new Agent({
            name, email, password, username, phone
        });

        await agent.save();

        res.redirect('/admin/agents');
    } catch (error) {
        console.log(error)
        return res.render('error', {
            status: 422,
            reason: 'Agent Creation Failed',
            message: `An error occurred on our side. If this error persists contact the admin`,
            link: '/register',
            linkMessage: 'Try Again'
        })
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function agentsHome(req, res) {
    try {
        var position = 1;

        const agents = (await Agent.find()).map(({ name, username, createdAt, status, _id }) => {
            const statusClass = (function (status) {
                // Custom getter to map status values to Bootstrap classes
                switch (status) {
                    case 'pending':
                        return 'text-info';
                    case 'terminated':
                        return 'text-danger';
                    case 'suspended':
                        return 'text-warning';
                    case 'active':
                        return 'text-success';
                    default:
                        return '';
                }
            })(status);
            return {
                position: position++, name, username, status, _id, statusClass, createdAt: moment(createdAt).format('MMM Do')
            }
        });

        res.render('admin-agents', {
            agents
        })
    } catch (error) {
        console.log(error)
        return res.render('error', {
            status: 500,
            reason: 'An Error Occurred',
            message: `An error occurred on our side. If this error persists contact the admin`,
            link: '/',
            linkMessage: 'BACK TO HOME'
        })
    }
}


/**
 * 
 * @param {Agent} agent 
 * @param {express.Response} response 
 */
function agentPage(agent, response) {
    if (agent) {
        response.render('admin-agent-viewer', {
            name: agent.name,
            _id: agent._id,
            createdAt: moment(agent.createdAt).fromNow(),
            username: agent.username,
            email: agent.email,
            phone: agent.email,
            status: agent.status,
        })
    } else {
        return response.render('error', {
            status: 404,
            reason: 'Agent Not Found',
            message: `The agent you are looking for does not exist, check the details and try again`,
            link: '/admin/agents',
            linkMessage: 'SEE ALL AGENTS'
        })
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns 
 */
async function agentById(req, res) {
    try {
        const agent = await Agent.findById(req.query.id);

        agentPage(agent, res)
    } catch (error) {
        console.log(error)
        return res.render('error', {
            status: 500,
            reason: 'An Error Occurred',
            message: `An error occurred on our side. If this error persists contact the admin`,
            link: '/',
            linkMessage: 'BACK TO HOME'
        })
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns 
 */
async function agentByEmail(req, res) {
    try {

        const agent = await Agent.findOne({ email: req.query.email });

        agentPage(agent, res)
    } catch (error) {
        console.log(error)
        return res.render('error', {
            status: 500,
            reason: 'An Error Occurred',
            message: `An error occurred on our side. If this error persists contact the admin`,
            link: '/',
            linkMessage: 'BACK TO HOME'
        })
    }
}


/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns 
 */
async function agentByPhone(req, res) {
    try {

        const agent = await Agent.findOne({ phone: req.query.phone });

        agentPage(agent, res)
    } catch (error) {
        console.log(error)
        return res.render('error', {
            status: 500,
            reason: 'An Error Occurred',
            message: `An error occurred on our side. If this error persists contact the admin`,
            link: '/',
            linkMessage: 'BACK TO HOME'
        })
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns 
 */
async function agentByUsername(req, res) {
    try {

        const agent = await Agent.findOne({ username: req.query.username });

        agentPage(agent, res)
    } catch (error) {
        console.log(error)
        return res.render('error', {
            status: 500,
            reason: 'An Error Occurred',
            message: `An error occurred on our side. If this error persists contact the admin`,
            link: '/',
            linkMessage: 'BACK TO HOME'
        })
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns 
 */
async function agentDetails(req, res) {
    if (req.query.id) {
        agentById(req, res);
    } else if (req.query.email) {
        agentByEmail(req, res);
    } else if (req.query.phone) {
        agentByPhone(req, res);
    } else if (req.query.username) {
        agentByUsername(req, res);
    } else {
        return res.render('error', {
            status: 400,
            reason: 'Bad Request',
            message: `You have provided insufficient agent information in your request`,
            link: '/admin/agents',
            linkMessage: 'SEE ALL AGENTS'
        })
    }
}


/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns 
 */
async function viewAgentByUsername(req, res) {
    try {

        const agent = await Agent.findOne({ username: req.params.username });

        agentPage(agent, res)
    } catch (error) {
        console.log(error)
        return res.render('error', {
            status: 500,
            reason: 'An Error Occurred',
            message: `An error occurred on our side. If this error persists contact the admin`,
            link: '/',
            linkMessage: 'BACK TO HOME'
        })
    }
}

/**
 * 
 * @param {express.Request} req
 * @param {express.Response} res 
 * @returns 
 */
async function setStatus(req, res) {
    try {
        const id = req.query.id;
        const status = req.query.status;

        if (!id) {
            return res.render('error', {
                status: 400,
                reason: 'Bad Request',
                message: `You must include agent id`,
                link: '/admin/agents',
                linkMessage: 'SEE ALL AGENTS'
            })
        }

        if (!['pending', 'terminated', 'suspended', 'active'].includes(status)) {
            return res.render('error', {
                status: 400,
                reason: 'Bad Request',
                message: `You can only set status to 'pending', 'terminated', 'suspended' or 'active' not '${status}'`,
                link: '/admin/agents',
                linkMessage: 'SEE ALL AGENTS'
            })
        }

        const agent = await Agent.findById(id);

        if (!agent) {
            return res.render('error', {
                status: 404,
                reason: 'Agent Not Found',
                message: `The agent you are trying to edit does not exist, check the details and try again`,
                link: '/admin/agents',
                linkMessage: 'SEE ALL AGENTS'
            })
        }

        agent.status = status;

        await agent.save();

        res.redirect('/admin/agent/' + agent.username)
    } catch (error) {
        console.log(error)
        return res.render('error', {
            status: 500,
            reason: 'An Error Occurred',
            message: `An error occurred on our side. If this error persists contact the admin`,
            link: '/',
            linkMessage: 'BACK TO HOME'
        })
    }
}

async function setPwd(req, res) {
    const {username, password, email} = req.body;

    console.log(req.body)

    if (!username || !email) {
        return res.render('error', {
            status: 400,
            reason: 'Bad Request',
            message: `You must include agent username and email in your request`,
            link: '/',
            linkMessage: 'BACK TO HOME'
        })
    }

    try {
        const agent = await Agent.findOne({username, email});

        if (!agent) {
            return res.render('error', {
                status: 404,
                reason: 'Agent Not Found',
                message: `The agent you are trying to edit does not exist, check the details and try again`,
                link: '/',
                linkMessage: 'SEE ALL AGENTS'
            })
        }

        if(agent.status === 'active'){
            return res.render('error', {
                status: 404,
                reason: 'Invalid Action',
                message: `Your account has already been activated`,
                link: '/login',
                linkMessage: 'LOGIN'
            })
        }
        const passwordHash = bcrypt.hashSync(password, 10);

        agent.password = passwordHash;
        agent.status = 'active';

        await agent.save();

        res.redirect('/login');
    } catch (error) {
        console.log(error)
        return res.render('error', {
            status: 500,
            reason: 'An Error Occurred',
            message: `An error occurred on our side. If this error persists contact the admin`,
            link: '/',
            linkMessage: 'BACK TO HOME'
        })
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns 
 */
async function agentDashboard(req, res){
    try {
        const agent = await Agent.findById(req.session.agentData._id);

        if (!agent) {
            return res.render('error', {
                status: 404,
                reason: 'Agent Not Found',
                message: `The agent you are trying to edit does not exist, check the details and try again`,
                link: '/login',
                linkMessage: 'TRY ANOTHER ACCOUNT'
            })
        }

        res.render('agentDashboard', {
            name: agent.name,
            _id: agent._id,
            createdAt: moment(agent.createdAt).fromNow(),
            username: agent.username,
            email: agent.email,
            phone: agent.email,
            status: agent.status,
        })
    } catch (error) {
        console.log(error)
        return res.render('error', {
            status: 500,
            reason: 'An Error Occurred',
            message: `An error occurred on our side. If this error persists contact the admin`,
            link: '/',
            linkMessage: 'BACK TO HOME'
        })
    }
}
module.exports = {
    create, home: agentsHome, agentDetails, viewAgentByUsername, setStatus, setPwd, agentDashboard
}