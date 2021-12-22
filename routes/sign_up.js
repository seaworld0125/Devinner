const express    = require('express');
const router     = express.Router();
const controller = require('../controller/sign_up');

router.get('/', controller.getLoginPage);

router.post('/', controller.createAccount);

router.get('/id', controller.checkId);

router.get('/nickname', controller.checkNickname);

module.exports = router;