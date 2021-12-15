const naver_id = 'KXvgDeQMNpKGEn1vIAZf';
const naver_key = 'ddSPdTPcu0';

const account = {'X-Naver-Client-Id': naver_id, 'X-Naver-Client-Secret': naver_key};

const url_base = 'https://openapi.naver.com/v1/search/news.json?query=';
const url_main = encodeURI(url_base + '주식');
const url_stock = encodeURI(url_base + '코스피+나스닥');
const url_kospi = encodeURI(url_base + '코스피');
const url_nasdaq = encodeURI(url_base + '나스닥');
const url_it = encodeURI(url_base + '개발자');
const url_coin = encodeURI(url_base + '코인');
const url_job = encodeURI(url_base + '취업+채용');

module.exports = {
    main_option: {  
        'method': 'GET',
        'url': url_job,
        'headers': account
    },
    stock_option: {  
        'method': 'GET',
        'url': url_stock,
        'headers': account
    },
    it_option: {  
        'method': 'GET',
        'url': url_it,
        'headers': account
    },
    coin_option: {  
        'method': 'GET',
        'url': url_coin,
        'headers': account
    },
}