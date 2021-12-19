const express   = require('express');
const router    = express.Router();
const mysql     = require("mysql2");

const pool      = require("../model/db_pool_creater");
const dbQuery   = require('../model/query');
const transaction = require('../model/article');

const fillZero = require('../Helpers/fill_zero');

// 게시글 작성 페이지
router.get('/', (req, res) => {
    if(!req.session.auth) {
        res.render('login_error', {});
        return;
    }  
    res.render('article', {"author" : req.session.nickname});
});

// 게시글 작성
router.post('/', (req, res) => {
    if(!req.session.auth) {
        res.render('login_error', {});
        return;
    }   

    let today = new Date();
    let date = today.getFullYear() + '-' + fillZero(2, today.getMonth()+1) + '-' + fillZero(2, today.getDate());
    let time = fillZero(2, today.getHours()) + ':' + fillZero(2, today.getMinutes()) + ':' + fillZero(2, today.getSeconds());

    let param = [0, 1, req.body.title, req.body.author, 0, 0, 'N', date, time];
    let board_query = mysql.format(dbQuery.NEW_BOARD, param);

    param = [0, req.body.content];
    let content_query = mysql.format(dbQuery.NEW_CONTENT, param);

    let queries = [board_query, content_query];

    transaction.postData(queries, pool)
    .then(() => {
        res.statusCode = 302;
        res.setHeader('Location', '/');
        res.end();
    })
    .catch((error) => {
        console.log(error);
        res.status(error.status || 500);
        res.render('error', {'error' : error.status});
    });
});
  
// 게시글 조회
router.get('/:number', (req, res) => {
    var updateQuery = mysql.format(dbQuery.UPDATE_VIEW, req.params.number);
    var getQuery = [mysql.format(dbQuery.GET_ARTICLE_INFO, req.params.number),
                    mysql.format(dbQuery.GET_COMMENT, req.params.number), 
                    mysql.format(dbQuery.GET_REPLY, req.params.number)];

    transaction.updateData(updateQuery, pool)
    .then(() => {
        transaction.getData(getQuery, pool)
        .then((data) => {
            let article = data[0][0];
            let comments = data[1];
            let replies = data[2];
            let auth = false;
            let nickname = "개미"; 
            if(req.session.auth) {
                auth = true;
                nickname = req.session.nickname;
            } 
            res.render("article_content", {"article" : article, "comments" : comments, "replies" : replies, "user" : {auth, nickname}});
        })
        .catch((error) => {
            throw error;
        });
    })
    .catch((error) => {
        console.log(error);
        res.status(error.status || 500);
        res.render("error");
    });
});

// 댓글 달기
router.post('/:number/comment', (req, res) => {
    if(!req.session.auth) {
        res.render('login_error', {});
        return;
    }   

    let number = req.params.number;
    let author = req.body.author;
    let comment = req.body.comment;

    var query = [mysql.format(dbQuery.NEW_COMMENT, [number, author, comment])];

    transaction.postData(query, pool)
    .then(() => {
        res.statusCode = 302;
        res.setHeader('Location', `/article/${number}`);
        res.end();
    })
    .catch((error) => {
        console.log(error);
        res.status(error.status || 500);
        res.render("error");
    });
});

// 댓글 수정
router.put('/:number/comment', (req, res) => {
    console.log("수정 요청 들어옴");

    if(!req.session.auth) {
        res.render('login_error', {});
        return;
    }
    console.log(req.body.data);

    let comment_id = req.params.number;
    let comment = req.body.data;

    var query = [mysql.format(dbQuery.UPDATE_COMMENT, [comment, comment_id])];

    transaction.postData(query, pool)
    .then(() => {
        res.statusCode = 201;
        res.end();
    })
    .catch((error) => {
        console.log(error);
        res.status(error.status || 500);
        res.render("error");
    });
});

// 답글 달기
router.post('/:number/reply', (req, res) => {
    if(!req.session.auth) {
        res.render('login_error', {});
        return;
    }   

    let number = req.params.number;
    let comment_id = req.body.comment_id;
    let author = req.body.author;
    let reply = req.body.reply;

    var query = [mysql.format(dbQuery.NEW_REPLY, [number, comment_id, author, reply])];

    transaction.postData(query, pool)
    .then(() => {
        res.statusCode = 302;
        res.redirect('back');
        res.end();
    })
    .catch((error) => {
        console.log(error);
        res.status(error.status || 500);
        res.render("error");
    });
});

// 게시글 삭제
router.delete('/:number', (req, res) => {
    if(!req.session.auth) {
        res.render('login_error', {});
        return;
    }   

    let number = req.params.number;
    let query = mysql.format(dbQuery.DELETE_ARTICLE, number);
    transaction.updateData(query, pool)
    .then(() => {
        res.statusCode = 200;
        res.end();
    })
    .catch((error) => {
        console.log(error);
        res.status(error.status || 500);
        res.render("error");
    });
});

// 댓글 삭제
router.delete('/:number/comment', (req, res) => {
    if(!req.session.auth) {
        res.render('login_error', {});
        return;
    }   

    let number = req.params.number;
    let query = mysql.format(dbQuery.DELETE_COMMENT, number);
    transaction.updateData(query, pool)
    .then(() => {
        res.statusCode = 200;
        res.end();
    })
    .catch((error) => {
        console.log(error);
        res.status(error.status || 500);
        res.render("error");
    });
});

// 답글 삭제
router.delete('/:number/reply', (req, res) => {
    if(!req.session.auth) {
        res.render('login_error', {});
        return;
    }   

    let number = req.params.number;
    let query = mysql.format(dbQuery.DELETE_REPLY, number);
    transaction.updateData(query, pool)
    .then(() => {
        res.statusCode = 200;
        res.end();
    })
    .catch((error) => {
        console.log(error);
        res.status(error.status || 500);
        res.render("error");
    });
});

module.exports = router;