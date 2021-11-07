var express = require('express');
var router = express.Router();
const mysql = require("mysql2");
const pool = require("../db/db2");

var dbQuery = require('../Helpers/query');

async function postArticle(query) {
    let connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        await connection.query(query.board_query);
        await connection.query(query.content_query);
        connection.commit();
        connection.release();

        return Promise.resolve();
    } 
    catch (error) {
        connection.rollback();
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
        console.log(req.session.nickname);
        res.render('article', {session : req.session});
    }
    else {
        res.render('login_error', {});
    }
});

// 게시글 POST
router.post('/', (req, res) => {
    console.log(req.body.author);
    console.log(req.body.title);
    console.log(req.body.content);

    let today = new Date();
    let date = today.getFullYear() + '-' + fillZero(2, today.getMonth()+1) + '-' + fillZero(2, today.getDate());
    let time = fillZero(2, today.getHours()) + ':' + fillZero(2, today.getMinutes()) + ':' + fillZero(2, today.getSeconds());

    let param = [0, 1, req.body.title, req.body.author, 0, 0, 'N', date, time];
    let board_query = mysql.format(dbQuery.NEW_BOARD, param);

    param = [0, req.body.content];
    let content_query = mysql.format(dbQuery.NEW_CONTENT, param);

    postArticle({board_query, content_query})
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
  
module.exports = router;