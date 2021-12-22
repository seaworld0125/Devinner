const express    = require('express');
const router     = express.Router();
const controller = require('../controller/main'); 

// 메인 페이지
router.get('/', controller.getMainPage);
  
module.exports = router;