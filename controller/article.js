const mysql = require('mysql2');
const dbQuery   = require('../model/query');
const fillZero  = require('../Helpers/fill_zero');
const service   = require('../service/article');
const { getData } = require('../service/article');

module.exports = {
    getWritingPage : (req, res) => {
        let page = (req.session.auth ? 'article' : 'login_error');
        let author = (req.session.auth ? {'author' : req.session.nickname} : {});
    
        return res.status(200).render(page, author);
    },
    postArticle : async (req, res, next) => {
        if(!req.session.auth)
            return res.render('login_error', {});
    
        let today = new Date();
        let date = today.getFullYear() + '-' + fillZero(2, today.getMonth()+1) + '-' + fillZero(2, today.getDate());
        let time = fillZero(2, today.getHours()) + ':' + fillZero(2, today.getMinutes()) + ':' + fillZero(2, today.getSeconds());
    
        let param = [0, req.body.tab, req.body.title, req.body.author, 0, 0, 'N', date, time];
        let board_query = mysql.format(dbQuery.NEW_ARTICLE, param);
    
        param = [0, req.body.editordata];
        let content_query = mysql.format(dbQuery.NEW_CONTENT, param);

        try {
            await service.postData(board_query);
            await service.postData(content_query);
        
            return res.status(303).redirect('/');
        }
        catch(error) {
            next(error);
        }
    },
    getArticle : async (req, res, next) => {
        var updateQuery = mysql.format(dbQuery.UPDATE_VIEW, req.params.number);
        let articleInfoQuery = mysql.format(dbQuery.GET_ARTICLE_INFO, req.params.number);
        let commentQuery = mysql.format(dbQuery.GET_COMMENT, req.params.number);
        let replyQuery = mysql.format(dbQuery.GET_REPLY, req.params.number);

        try {
            await service.postData(updateQuery);
            let article = await service.getData(articleInfoQuery);
            let comments = await service.getData(commentQuery);
            let replies = await service.getData(replyQuery);

            let auth = (req.session.auth ? true : false);
            let nickname = (req.session.auth ? req.session.nickname : undefined);

            return res.status(200).render('article_content', {'article' : article[0], 'comments' : comments, 'replies' : replies, 'user' : {auth, nickname}});
        }
        catch(error) {
            next(error);
        }
    },
    postComment : async (req, res, next) => {
        if(!req.session.auth)
            return res.status(401).send(new Error('auth error'));
    
        let number = req.params.number;
        let author = req.body.author;
        let comment = req.body.comment.replace(/<[^>]+>/g, '');
        let query = mysql.format(dbQuery.NEW_COMMENT, [number, author, comment]);

        try {
            await service.postData(query);

            return res.status(303).redirect('/article/' + number);
        }
        catch(error) {
            next(error);
        }
    },
    modComment : async (req, res, next) => {
        if(!req.session.auth)
            return res.status(401).send(new Error('auth error'));
    
        let comment_id = req.params.number;
        let comment = req.body.data.replace(/<[^>]+>/g, '');
        let query = mysql.format(dbQuery.UPDATE_COMMENT, [comment, comment_id]);

        try {
            await service.postData(query);

            return res.status(201).end();
        }
        catch(error) {
            next(error);
        }
    },
    postReply : async (req, res, next) => {
        if(!req.session.auth)
            return res.status(401).send(new Error('auth error'));
    
        let number = req.params.number;
        let comment_id = req.body.comment_id;
        let author = req.body.author;
        let reply = req.body.reply.replace(/<[^>]+>/g, '');
        var query = mysql.format(dbQuery.NEW_REPLY, [number, comment_id, author, reply]);

        try {
            await service.postData(query);

            return res.status(303).redirect('/article/' + number);
        }
        catch(error) {
            next(error);
        }
    },
    deleteArticle : async (req, res, next) => {
        if(!req.session.auth)
            return res.status(401).send(new Error('auth error'));
    
        let number = req.params.number;
        let query = mysql.format(dbQuery.DELETE_ARTICLE, number);

        try {
            await service.postData(query);

            return res.status(200).end();
        }
        catch(error) {
            next(error);
        }
    },
    deleteComment : async (req, res, next) => {
        if(!req.session.auth)
            return res.status(401).send(new Error('auth error'));
    
        let number = req.params.number;
        let query = mysql.format(dbQuery.DELETE_COMMENT, number);

        try {
            await service.postData(query);

            return res.status(200).end();
        }
        catch(error) {
            next(error);
        }
    },
    deleteReply : async (req, res, next) => {
        if(!req.session.auth)
            return res.status(401).send(new Error('auth error'));
    
        let number = req.params.number;
        let query = mysql.format(dbQuery.DELETE_REPLY, number);

        try {
            await service.postData(query);

            return res.status(200).end();
        }
        catch(error) {
            next(error);
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

            // 추천이 가능하면
            let number = req.params.number;
            // 추천 테이블에 닉네임 추가
            query = mysql.format(dbQuery.ADD_RECOMMEND, [number, req.session.nickname]);
            await service.postData(query);
            // 게시글 추천수 수정
            query = mysql.format(dbQuery.UPDATE_HITS, [number]);
            await service.postData(query);

            return res.status(200).send(true);
        }
        catch(error) {
            next(error);
        }
    },
}