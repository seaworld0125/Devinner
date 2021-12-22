const express   = require('express');
const router    = express.Router();
const controller = require('../controller/article');

// 게시글 작성 페이지
router.get('/', controller.getWritingPage);

// 게시글 작성
router.post('/', controller.postArticle);
  
// 게시글 조회
router.get('/:number', controller.getArticle);

// 댓글 달기
router.post('/:number/comment', controller.postComment);

// 댓글 수정
router.put('/:number/comment', controller.modComment);

// 답글 달기
router.post('/:number/reply', controller.postReply);

// 게시글 삭제
router.delete('/:number', controller.deleteArticle);

// 댓글 삭제
router.delete('/:number/comment', controller.deleteComment);

// 답글 삭제
router.delete('/:number/reply', controller.deleteReply);

module.exports = router;