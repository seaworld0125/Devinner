const naver_id = 'KXvgDeQMNpKGEn1vIAZf';
const naver_key = 'ddSPdTPcu0';
const url_kospi = encodeURI('https://openapi.naver.com/v1/search/news.json?query=코스피');

module.exports = {
    kospi_option : {  
        'method': 'GET',
        'url': url_kospi,
        'headers': {
            'X-Naver-Client-Id': naver_id,
            'X-Naver-Client-Secret': naver_key,
        }
    },
}