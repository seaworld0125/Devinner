const express   = require('express');
const router    = express.Router();
const controller = require('../controller/auth');

router.post('/', controller.login);

router.get('/', controller.logout);

module.exports = router;