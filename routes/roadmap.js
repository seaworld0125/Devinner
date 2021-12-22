const express       = require('express');
const router        = express.Router();
const controller    = require('../controller/roadmap');

router.get('/', controller.getRoadmapPage);
  
router.get('*', controller.getCardPage);

module.exports = router;