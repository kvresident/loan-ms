require('dotenv').config();


const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res)=>{
    res.json({success: 'Connected successfully'});
});

app.get('/login', (req, res)=>{
    res.render('login');
})

app.get('/register', (req, res)=>{
    res.render('register');
})

let port = process.env.port;
const uri = process.env.uri;

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