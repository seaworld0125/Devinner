var express = require('express');
var router = express.Router();

// 게시글 작성 페이지
router.get('/', (req, res) => {
    res.render('article', {});
});

// 게시글 POST
router.post('/', (req, res) => {
    console.log(req.query.title);
    console.log(req.query.content);
});
  
module.exports = router;