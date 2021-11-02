var express = require('express');
var router = express.Router();
var MySQL = require("MySQL2");
var dbQuery = require('../Helpers/query-string');

// config
var config = require('../conf/app.js');
var DB = MySQL.createConnection({
    host : config.db_host,
    user : config.db_user,
    password : config.db_password,
    database : config.db_database
});

function fillZero(width, data){
    let str = data.toString();
    return str.length >= width ? str:new Array(width-str.length+1).join('0')+str;//남는 길이만큼 0으로 채움
}

// 게시글 작성 페이지
router.get('/', (req, res) => {
    res.render('article', {});
});

// 게시글 POST
router.post('/', (req, res) => {
    console.log(req.body.author);
    console.log(req.body.title);
    console.log(req.body.content);

    let today = new Date();
    let date = today.getFullYear() + '-' + fillZero(2, today.getMonth()) + '-' + fillZero(2, today.getDate());
    let time = fillZero(2, today.getHours()) + ':' + fillZero(2, today.getMinutes()) + ':' + fillZero(2, today.getSeconds());
    console.log(date, ', ', time);

    // INSERT INTO board value(0, 1, "test_title01", "test_author01", 0, 'N', "2021-12-31", "23:59:59");  
    // (pk, group_id, title, author, view, if_delete, date, time)
    var param = [0, 1, req.body.title, req.body.author, 0, 'N', date, time];
    let board_query = MySQL.format(dbQuery.NEW_BOARD, param);
    console.log(board_query);

    // INSERT INTO content value(0, "테스트 내용입니다.");
    // (pk, content)
    param = [0, req.body.content];
    let content_query = MySQL.format(dbQuery.NEW_CONTENT, param);
    console.log(content_query);

    // let new_board_query = board_query + ';' + content_query + ';';
    // console.log(new_board_query);

    DB.query(
        board_query,
        function(err, results, fields) {
            if(err) throw err;

            DB.query(
                content_query,
                function(err, results, fields) {
                    if(err) throw err;
        
                    res.statusCode = 302;
                    res.setHeader('Location', '/');
                    res.end();
                }   
            );
        }   
    );
});
  
module.exports = router;