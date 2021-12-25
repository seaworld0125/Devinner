const express    = require('express');
const router     = express.Router();
const controller = require('../controller/users'); 

// get user mypage
router.get('/mypage', controller.getMypage);

// change nickname
router.put('/nicknames/:nickname', controller.changeNickname);

// check nickname unique
router.get('/nicknames/:nickname/unique', controller.checkNickname);

// change github id
router.put('/github/:github', controller.changeGithubId);

// get user github id
router.get('/github/:nickname', controller.getUserGithubId);

module.exports = router;