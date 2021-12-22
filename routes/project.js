const express       = require('express');
const router        = express.Router();
const controller    = require('../controller/project');

router.get('/', controller.getProjectPage);
  
module.exports = router;