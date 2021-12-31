const mysql = require('mysql2');
const dbQuery   = require('../model/query');
const fillZero  = require('../Helpers/fill_zero');
const service   = require('../service/article');
const sanitize_func = require('../Helpers/validator');

module.exports = {
    getWritingPage : (req, res) => {
        if(!req.session.auth)
            return res.status(403).render('login_error', {});
    
        return res.status(200).render('article', {'author' : req.session.nickname, 'manager' : req.session.manager});
    },
    postArticle : async (req, res, next) => {
        if(!req.session.auth)
            return res.status(403).render('login_error', {});

        let today = new Date();
        let date = today.getFullYear() + '-' + fillZero(2, today.getMonth()+1) + '-' + fillZero(2, today.getDate());
        let time = fillZero(2, today.getHours()) + ':' + fillZero(2, today.getMinutes()) + ':' + fillZero(2, today.getSeconds());
        
        let title = sanitize_func.notAllowedAllHtml(req.body.title);
        let tab = sanitize_func.notAllowedAllHtml(req.body.tab);
        let author = sanitize_func.notAllowedAllHtml(req.body.author);
        let edit_data = sanitize_func.allowedDefaultHtml(req.body.editordata);

        if(!tab || (Number(tab) === 0 && !req.session.manager) || !title || !author || !edit_data) return res.status(303).redirect('/');

        let param = [0, tab, title, author, 0, 0, 'N', date, time];
        let board_query = mysql.format(dbQuery.NEW_ARTICLE, param);

        param = [0, edit_data];
        let content_query = mysql.format(dbQuery.NEW_CONTENT, param);
        
        try {
            await service.postData(board_query);
            await service.postData(content_query);
        
            return res.status(303).redirect('/');
        }
        catch(error) {
            return next(error);
        }
    },
    getArticle : async (req, res, next) => {
        let updateQuery = mysql.format(dbQuery.UPDATE_VIEW, req.params.number);
        let articleInfoQuery = mysql.format(dbQuery.GET_ARTICLE_INFO, req.params.number);
        let commentQuery = mysql.format(dbQuery.GET_ARTICLE_COMMENT, req.params.number);
        let replyQuery = mysql.format(dbQuery.GET_ARTICLE_REPLY, req.params.number);

        try {
            await service.postData(updateQuery);
            let article = await service.getData(articleInfoQuery);
            if(!article[0]) return res.status(400).render('login_error', {});

            let comments = await service.getData(commentQuery);
            let replies = await service.getData(replyQuery);

            let auth = (req.session.auth ? true : false);
            let manager = (req.session.auth ? req.session.manager : false);
            let nickname = (req.session.auth ? req.session.nickname : undefined);

            return res.status(200).render('article_content', {'article' : article[0], 'comments' : comments, 'replies' : replies, 'user' : {auth, manager, nickname}});
        }
        catch(error) {
            return next(error);
        }
    },
    postComment : async (req, res, next) => {
        if(!req.session.auth)
            return res.status(401).send(new Error('auth error'));

        let number = sanitize_func.notAllowedAllHtml(req.params.number);
        let author = sanitize_func.notAllowedAllHtml(req.body.author);
        let comment = sanitize_func.notAllowedAllHtml(req.body.comment);

        if(!number || !author || !comment) return res.status(303).redirect('/article/' + number);
            
        let query = mysql.format(dbQuery.NEW_COMMENT, [number, author, comment]);
        console.log(query);
        try {
            await service.postData(query);
            return res.status(303).redirect('/article/' + number);
        }
        catch(error) {
            return next(error);
        }
    },
    modComment : async (req, res, next) => {
        if(!req.session.auth)
            return res.status(401).send(new Error('auth error'));

        if(!req.params.number || !req.body.data) return res.status(201).end();
    
        try {
            let query = mysql.format(dbQuery.GET_COMMENT, req.params.number);
            let comment = await service.getData(query);
            let comment_id = sanitize_func.notAllowedAllHtml(req.params.number);
            let comment_body = sanitize_func.notAllowedAllHtml(req.body.data);

            if(!comment[0] || comment[0].author !== req.session.nickname || !comment_id || !comment_body) return res.status(400).end();

            query = mysql.format(dbQuery.UPDATE_COMMENT, [comment_body, comment_id]);
            await service.postData(query);
            return res.status(201).end();
        }
        catch(error) {
            return next(error);
        }
    },
    postReply : async (req, res, next) => {
        if(!req.session.auth)
            return res.status(401).send(new Error('auth error'));
    
        let number = sanitize_func.notAllowedAllHtml(req.params.number);
        let comment_id = sanitize_func.notAllowedAllHtml(req.body.comment_id);
        let author = sanitize_func.notAllowedAllHtml(req.body.author);
        let reply = sanitize_func.notAllowedAllHtml(req.body.reply);
        
        if(!number || !comment_id || !author || !reply) return res.status(303).redirect('/article/' + number);    
            
        let query = mysql.format(dbQuery.NEW_REPLY, [number, comment_id, author, reply]);

        try {
            await service.postData(query);
            return res.status(303).redirect('/article/' + number);
        }
        catch(error) {
            return next(error);
        }
    },
    deleteArticle : async (req, res, next) => {
        if(!req.session.auth)
            return res.status(401).send(new Error('auth error'));
            
        try {
            let number = req.params.number;
            let query = mysql.format(dbQuery.GET_ARTICLE_INFO, number);
            let article = await service.getData(query);

            if(!req.session.manager && (!article[0] || article[0].author !== req.session.nickname)) return res.status(400).end();

            query = mysql.format(dbQuery.DELETE_ARTICLE, number);
            await service.postData(query);
            return res.status(200).end();
        }
        catch(error) {
            return next(error);
        }
    },
    deleteComment : async (req, res, next) => {
        if(!req.session.auth)
            return res.status(401).send(new Error('auth error'));
                
        try {
            let number = req.params.number;
            let query = mysql.format(dbQuery.GET_COMMENT, number);
            let comment = await service.getData(query);

            if(!req.session.manager && (!comment[0] || comment[0].author !== req.session.nickname)) return res.status(400).end();

            query = mysql.format(dbQuery.DELETE_COMMENT, number);
            await service.postData(query);
            return res.status(200).end();
        }
        catch(error) {
            return next(error);
        }
    },
    deleteReply : async (req, res, next) => {
        if(!req.session.auth)
            return res.status(401).send(new Error('auth error'));    
            
        try {
            let number = req.params.number;
            let query = mysql.format(dbQuery.GET_REPLY, number);
            let reply = await service.getData(query);

            if(!req.session.manager && (!reply[0] || reply[0].author !== req.session.nickname)) return res.status(400).end();

            query = mysql.format(dbQuery.DELETE_REPLY, number);
            await service.postData(query);
            return res.status(200).end();
        }
        catch(error) {
            return next(error);
        }
    },
    recommend : async (req, res, next) => {
        if(!req.session.auth)
            return res.status(401).send(new Error('auth error'));
            
        try {
            // 추천이 가능한지 확인
            let nickname = req.session.nickname;
            let query = mysql.format(dbQuery.CHECK_RECOMMEND_NICKNAME, [nickname]);

            let result = await service.getData(query);
            if(result[0])
                return res.status(200).send(false);

            let number = req.params.number;
            
            query = mysql.format(dbQuery.ADD_RECOMMEND, [number, req.session.nickname]);
            await service.postData(query);
            
            query = mysql.format(dbQuery.UPDATE_HITS, [number]);
            await service.postData(query);
            return res.status(200).send(true);
        }
        catch(error) {
            return next(error);
        }
    },
}
