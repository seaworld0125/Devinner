var express = require('express');
var router = express.Router();
const mysql = require("mysql2");
const pool = require("../db/db2");

var dbQuery = require('../Helpers/query');
const INET = require('../Helpers/inet');

async function checkUnique(checkQuery) {
    let connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        let data = await connection.query(checkQuery);
        connection.release();

        if(data[0][0]) return Promise.resolve(false);
        else return Promise.resolve(true);
    }
    catch (error) {
        connection.release();
        return Promise.reject(new Error(error));
    }
}

async function makeAccount(makeQuery) {
    let connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        await connection.query(makeQuery);
        connection.commit();
        connection.release();

        return Promise.resolve(true);
    }
    catch (error) {
        connection.rollback();
        connection.release();
        return Promise.reject(new Error(error));
    }
}

router.get('/', (req, res) => {
    if(req.session.auth) {
        res.render('login_error', {});
    }
    else {
        res.render('sign_up', {});
    }
});

router.post('/', (req, res) => {
    if(req.session.auth) {
        res.render('login_error', {});
    }
    else {
        let id = req.body.id;
        let password = req.body.password;
        let nickname = req.body.nickname;
        let ip = INET.aton(req.body.ip);
        
        let values = [0, id, password, nickname, ip];
        let makeQuery = mysql.format(dbQuery.CREATE_ACCOUNT, values);

        console.log(makeQuery);

        makeAccount(makeQuery)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            res.send(error);
        });
    }
});

router.get('/id', (req, res) => {
    if(req.session.auth) {
        res.render('login_error', {});
    }
    else {
        console.log(req.query.id);
        let id = req.query.id;
        let checkQuery = mysql.format(dbQuery.CHECK_USERNAME, id);
        console.log(checkQuery);

        checkUnique(checkQuery)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            res.send(error);
        });
    }
});

router.get('/nickname', (req, res) => {
    if(req.session.auth) {
        res.render('login_error', {});
    }
    else {
        console.log(req.query.nickname);
        let nickname = req.query.nickname;
        let checkQuery = mysql.format(dbQuery.CHECK_NICKNAME, nickname);
        console.log(checkQuery);

        checkUnique(checkQuery)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            res.send(error);
        });
    }
});

module.exports = router;