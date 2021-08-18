const secret_ = require('./module_secret.js');

var url_kospi = encodeURI('https://openapi.naver.com/v1/search/news.json?query=코스피');

module.exports = {
    kospi_option : {  
        'method': 'GET',
        'url': url_kospi,
        'headers': {
        'X-Naver-Client-Id': secret_.naver_id,
        'X-Naver-Client-Secret': secret_.naver_password,
    }},
}