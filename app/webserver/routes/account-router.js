'use strict';

const express = require('express');

const router = express.Router();

const createAccount = require('../controllers/account/create-account-controller');
router.post('/account', createAccount);

const checkAccount = require('../controllers/account/check-account-controller');
router.post('/account', checkAccount);

router.get('/cuenta', (req, res, next) => res.send('Pestaña cuenta'));

module.exports = router;
