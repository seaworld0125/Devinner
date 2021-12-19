const express       = require('express');
const router        = express.Router();
const request       = require("request");

const pool          = require("../model/db_pool_creater");
const dbQuery       = require("../model/query");
const transaction   = require("../model/main");

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

/* GET home page. */
router.get('/', (req, res) => {
    transaction.getBoardList(dbQuery.GET_BOARD_LIST, pool)
    .then((board_list) => {
        res.render("main", {"board_list" : board_list, "session" : (req.session.auth ? req.session : undefined), "news" : main_news});
    })
    .catch((error) => {
        console.log(error);
        res.status(error.status || 500);
        res.render("error");
    });
});
  
module.exports = router;