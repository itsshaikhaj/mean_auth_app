const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const config = require('./config/database');
var session = require('express-session')

// Connect to database
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });

// On Connection
mongoose.connection.on('connected', () => {
    console.log('Connected to database ' + config.database);
});

// On Error 
mongoose.connection.on('error', (err) => {
    console.log('Database error: ' + err);
});

const app = express();

const users = require('./routes/users');
// PORT NUMBER
const port = 3000;

// CORS MIDDLEWARE
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));



// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
// Passport Config
require('./config/passport')(passport);


// BODY PARSER MIDDLEWARE
app.use(bodyParser.json());
app.use('/users', users);



//Index Route
app.get('/', (req, res) => {
   res.send('Hello World!'); 
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Server Start 
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
    });
