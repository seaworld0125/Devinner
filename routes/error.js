const express   = require('express');
const router    = express.Router();
const controller = require('../controller/error');

router.get('/:err', controller.getErrorPage);

module.exports = router;