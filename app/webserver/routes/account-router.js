'use strict';

const express = require('express');

const router = express.Router();

// const createAccount = require('./controllers/account/create-account-controller.js');

// app.post('/accounts', createAccount);

router.get('/cuenta', (req, res, next) => res.send('Pestaña cuenta'));

module.exports = router;
