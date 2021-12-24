const express       = require('express');
const router        = express.Router();
const controller    = require('../controller/project');

router.get('/', controller.getProjectPage);

router.get('/:user', controller.getUserProject);
  
module.exports = router;