var express = require('express');
var router = express.Router();
const mysql = require("mysql2");
const pool = require("../db/db2");

var dbQuery = require('../Helpers/query');

async function getBoardList(getQuery) {
    let connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        let data = await connection.query(getQuery);
        connection.release();

        return Promise.resolve(data[0].reverse());    
    } 
    catch (error) {
        console.log(error);
        connection.release();

        return Promise.reject(new Error(error));
    }
}

/* GET home page. */
router.get('/', (req, res) => {

    getBoardList(dbQuery.GET_BOARD_LIST)
    .then((board_list) => {
        var session;

        if(req.session.auth) {
            session = req.session;
            res.render('index', {'board_list' : board_list, 'session' : session});
        }
        else {
            res.render('index', {'board_list' : board_list, 'session' : session});
        }
    })
    .catch((error) => {
        console.log(error);
        res.status(error.status || 500);
        res.render('error');
    });
});
  
module.exports = router;