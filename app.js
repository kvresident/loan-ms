require('dotenv').config();


const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');



const adminAuth = require('./middleware/adminAuth');

const app = express();



app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(session({
    secret: process.env.SESSION_SECRET, // Change this to a strong and secure secret
    resave: false,
    saveUninitialized: false
}));


app.use(express.urlencoded({extended: true}));
app.use(express.json());




app.use('/agent', require('./routes/agents.js'));
app.use('/admin', adminAuth, require('./routes/admin.js'));
app.use('/loan', require('./routes/loan.js'))
app.use('/customer', require('./routes/customer'));

app.get('/', (req, res) => {
    res.render('index');
});

app.use('/login', require('./routes/login.js') )

app.get('/register',adminAuth, (req, res) => {
    res.render('register');
})
app.get('/guide', (req, res)=>{
    res.render('help');
})
let port = process.env.port;
const uri = process.env.offline_uri;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(result => {
    app.listen(port, () => {
        console.log('app listening on http://127.0.0.1:' + port);
    })
}).catch(err => {
    console.log(err)
})


app.use((req, res)=>{
    res.render('error', {
        status: 400,
        reason: 'Resource not found',
        message: `We’re sorry, the resource ${req.url} could not be located! Check the url and try again`,
        link: '/',
        linkMessage: 'Go back home'
    })
})