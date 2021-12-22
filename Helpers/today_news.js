const request       = require("request");
const news_config   = require("../conf/news");

let news = [];

request(news_config.main_option, function (error, response) {
    if (error) throw new Error(error);

    let arr = JSON.parse(response.body);

    Object.values(arr)[4].forEach(element => {

        let {title, link, description} = element;
        news.push({
            "title" : title, 
            "description" : description,
            "link" : link
        });
    });
});

module.exports = news;