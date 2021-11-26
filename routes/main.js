const express       = require('express');
const router        = express.Router();
const pool          = require("../db/db_pool_creater");
const dbQuery       = require("../Helpers/query");
const mysql         = require("mysql2");

const request       = require("request");
const news_config   = require("../conf/news");

var main_news = new Array();
request(news_config.main_option, function (error, response) {
    if (error) throw new Error(error);

    let arr = JSON.parse(response.body);

    Object.values(arr)[4].forEach(element => {

        let {title, link, description} = element;
        main_news.push({
            "title" : title, 
            "description" : description,
            "link" : link
        });
    });
});

async function getData(query) {
    let connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        let data = await connection.query(query);
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
    getData(dbQuery.GET_BOARD_LIST)
    .then((board_list) => {
        var session;

        if(req.session.auth) {
            session = req.session;
            res.render("main", {"board_list" : board_list, "session" : session, "news" : main_news});
        }
        else {
            res.render("main", {"board_list" : board_list, "session" : session, "news" : main_news});
        }
    })
    .catch((error) => {
        console.log(error);
        res.status(error.status || 500);
        res.render("error");
    });
});
  
module.exports = router;