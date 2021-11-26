const express   = require('express');
const router    = express.Router();
const mysql     = require("mysql2");
const pool      = require("../db/db_pool_creater");

const dbQuery   = require('../Helpers/query');

async function postData(query) {
    let connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        for(let element of query)
            await connection.query(element);

        await connection.commit();
        connection.release();

        return Promise.resolve();
    } 
    catch (error) {
        await connection.rollback();
        connection.release();
        
        return Promise.reject(new Error(error));
    }
}
async function updateData(query) {
    let connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        await connection.query(query);
        await connection.commit();
        connection.release();

        return Promise.resolve();    
    } 
    catch (error) {
        await connection.rollback();
        connection.release();

        return Promise.reject(new Error(error));
    }
}
async function getData(query) {
    let connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        let data = [];
        for(let element of query) {
            let tmp = await connection.query(element);
            data.push(tmp[0]);
        }
        connection.release();

        return Promise.resolve(data);    
    } 
    catch (error) {
        console.log(error);
        connection.release();

        return Promise.reject(new Error(error));
    }
}

function fillZero(width, data){
    let str = data.toString();
    return str.length >= width ? str:new Array(width-str.length+1).join('0')+str;//남는 길이만큼 0으로 채움
}

// 게시글 작성 페이지
router.get('/', (req, res) => {
    if(req.session.auth) {
        res.render('article', {"author" : req.session.nickname});
    }
    else {
        res.render('login_error', {});
    }
});

// 게시글 POST
router.post('/', (req, res) => {
    if(req.session.auth) {
        let today = new Date();
        let date = today.getFullYear() + '-' + fillZero(2, today.getMonth()+1) + '-' + fillZero(2, today.getDate());
        let time = fillZero(2, today.getHours()) + ':' + fillZero(2, today.getMinutes()) + ':' + fillZero(2, today.getSeconds());
    
        let param = [0, 1, req.body.title, req.body.author, 0, 0, 'N', date, time];
        let board_query = mysql.format(dbQuery.NEW_BOARD, param);
    
        param = [0, req.body.content];
        let content_query = mysql.format(dbQuery.NEW_CONTENT, param);

        let queries = [board_query, content_query];
    
        postData(queries)
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
    }
    else {
        res.render('login_error', {});
    }
});
  
// 게시글 조회
router.get('/:number', (req, res) => {
    var updateQuery = mysql.format(dbQuery.UPDATE_VIEW, req.params.number);
    var getQuery = [mysql.format(dbQuery.GET_ARTICLE_INFO, req.params.number),
                    mysql.format(dbQuery.GET_COMMENT, req.params.number), 
                    mysql.format(dbQuery.GET_REPLY, req.params.number)];

    updateData(updateQuery)
    .then(() => {
        getData(getQuery)
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
    if(req.session.auth) {
        let number = req.params.number;
        let author = req.body.author;
        let comment = req.body.comment;

        var query = [mysql.format(dbQuery.NEW_COMMENT, [number, author, comment])];
    
        postData(query)
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
    }
    else {
        res.render('login_error', {});
    }
});
// 댓글 수정
router.put('/:number/comment', (req, res) => {
    if(req.session.auth) {
        let number = req.params.number;
        let author = req.body.author;
        let comment = req.body.comment;

        var query = [mysql.format(dbQuery.NEW_COMMENT, [number, author, comment])];
    
        postData(query)
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
    }
    else {
        res.render('login_error', {});
    }
});
// 답글 달기
router.post('/:number/reply', (req, res) => {
    if(req.session.auth) {
        let number = req.params.number;
        let comment_id = req.body.comment_id;
        let author = req.body.author;
        let reply = req.body.reply;

        var query = [mysql.format(dbQuery.NEW_REPLY, [number, comment_id, author, reply])];
    
        postData(query)
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
    }
    else {
        res.render('login_error', {});
    }
});

module.exports = router;