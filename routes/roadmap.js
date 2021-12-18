const express       = require('express');
const router        = express.Router();
// const pool          = require("../model/db_pool_creater");
// const dbQuery       = require("../model/query");
// const mysql         = require("mysql2");

// const request       = require("request");
// const news_config   = require("../conf/news");

// var main_news = new Array();
// request(news_config.main_option, function (error, response) {
//     if (error) throw new Error(error);

//     let arr = JSON.parse(response.body);

//     Object.values(arr)[4].forEach(element => {

//         let {title, link, description} = element;
//         main_news.push({
//             "title" : title, 
//             "description" : description,
//             "link" : link
//         });
//     });
// });

async function getBoardList(query) {
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
    res.render("roadmap", {"session" : (req.session.auth ? req.session : undefined)});
});
  
router.get('*', (req, res) => {
    let url = req.url;
    res.render(url.substr(1, url.length-1));
});
// router.get('/web', (req, res) => {

// });
// router.get('/mobile', (req, res) => {
    
// });
// router.get('/game', (req, res) => {
    
// });
// router.get('/embedded', (req, res) => {
    
// });

module.exports = router;