const express       = require('express');
const router        = express.Router();
const controller    = require('../controller/about');

router.get('/', controller.getAboutPage);
  
module.exports = router;