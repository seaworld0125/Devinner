const express       = require('express');
const router        = express.Router();
const controller    = require('../controller/activity');

router.get('/', controller.getActivityPage);
  
module.exports = router;