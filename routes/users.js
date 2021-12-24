const express    = require('express');
const router     = express.Router();
const controller = require('../controller/users'); 

// router.get('/')

router.get('/:nickname', controller.getUserGithubId);

module.exports = router;