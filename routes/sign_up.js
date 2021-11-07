var express = require('express');
var router = express.Router();
const mysql = require("mysql2");
const pool = require("../db/db2");

var dbQuery = require('../Helpers/query');

async function checkUnique(checkQuery) {
    let connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        let data = connection.query(checkQuery);
        connection.release();

        if(data[0][0]) return Promise.resolve(true);
        else return Promise.resolve(false);
    }
    catch (error) {
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

router.get('/id', (req, res) => {
    if(req.session.auth) {
        res.render('login_error', {});
    }
    else {
        console.log(req.query.id);
        let id = req.query.id;
        let checkQuery = mysql.format(dbQuery.CHECK_USERNAME, id);

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
        res.render('sign_up', {});
    }
});

module.exports = router;