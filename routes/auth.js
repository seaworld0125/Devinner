var express = require('express');
var router = express.Router();
const mysql = require("mysql2");
const pool = require("../db/db2");

var dbQuery = require('../Helpers/query');

async function checkAccount(checkQeury) {
    let connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        let data = await connection.query(checkQeury);
        connection.release();
        
        return Promise.resolve(data[0][0]);
    } 
    catch (error) {
        console.log(error);
        connection.release();
        
        return Promise.reject(new Error(error));
    }
}

router.post('/', (req, res) => {
    let id = req.body.id;
    let password = req.body.password;

    let checkQeury = mysql.format(dbQuery.CHECK_ACCOUNT, [id]);
    // console.log(checkQeury);

    checkAccount(checkQeury).then((result) => {
        if(result && result.password == password) {
            req.session.auth = true;
            req.session.nickname = result.nickname;

            console.log(result.nickname);
            req.session.save((err) => {
                if(err) {
                    console.log(err);
                    res.status(error.status || 500);
                    res.render('error');
                }
                else {
                    console.log("로그인 성공");
                    res.statusCode = 302;
                    res.setHeader('Location', '/');
                    res.end();
                }
            });
        } 
        else{
            res.statusCode = 302;
            res.setHeader('Location', '/');
            res.end();
        }
    });
});

router.get('/', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            res.status(error.status || 500);
            res.render('error');
        }
        else {
            res.statusCode = 302;
            res.setHeader('Location', '/');
            res.end();
        }
    });
});

module.exports = router;