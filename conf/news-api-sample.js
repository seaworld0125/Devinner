const naver_id = 'your_id';
const naver_key = 'your_key';
const url_kospi = encodeURI('https://openapi.naver.com/v1/search/news.json?query=코스피');

module.exports = {
    kospi_option: {  
        'method': 'GET',
        'url': url_kospi,
        'headers': {
            'X-Naver-Client-Id': naver_id,
            'X-Naver-Client-Secret': naver_key,
        }
    },
}