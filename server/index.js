const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');

// DB Setup
mongoose.connect('mongodb://localhost:auth/auth', { useNewUrlParser: true });

// App Setup
app.use(morgan('combined')); // middleware to log request
app.use(bodyParser.json({ type: '*/*' })); // middleware to parse request
router(app);

// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('server listening on', port);
