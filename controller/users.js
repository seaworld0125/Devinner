const mysql   = require('mysql2');
const db = require('../conf/db');
const dbQuery = require('../model/query');
const service = require('../service/users');
const sanitize_func = require('../Helpers/sanitize_func');

module.exports = {
    getUserGithubId : async (req, res, next) => {
        let nickname = req.params.nickname;
        let query = mysql.format(dbQuery.GET_GITHUB_ID, [nickname]);

        try {
            let data = await service.getData(query);

            return res.json(data[0]);
        }
        catch(error) {
            return res.json({'error' : error});
        }
    },
    getMypage : async (req, res, next) => {
        if(!req.session.auth)
            return res.status(403).render('login_error');

        let nickname = req.session.nickname;
        try {
            let query = mysql.format(dbQuery.GET_USER_INFO, nickname);
            let info = await service.getData(query);

            query = mysql.format(dbQuery.GET_USER_PROJECTS, nickname);
            let projects = await service.getData(query);

            return res.status(200).render('mypage', {'user' : info[0], 'projects' : projects});
        }
        catch(error) {
            return next(error);
        }
    },
    checkNickname : async (req, res) => {
        if(!req.session.auth) {
            return res.status(403).render('login_error');
        }

        let query = mysql.format(dbQuery.CHECK_NICKNAME, req.params.nickname);
        try {
            let result = await service.getData(query);

            return res.status(200).send(result.length ? false : true).end();
        } 
        catch(error) {
            return next(error);
        }
    },
    changeNickname : async (req, res, next) => {
        if(!req.session.auth)
            return res.status(403).render('login_error');

        let new_nickname = sanitize_func.notAllowedAll(nickname);
        if(!new_nickname) return res.status(400).send(false);

        let param = [req.params.nickname, req.session.nickname];
        try {
            let query = mysql.format(dbQuery.UPDATE_NICKNAME, param);
            await service.putData(query);

            query = mysql.format(dbQuery.UPDATE_BOARD_AUTHOR, param);
            await service.putData(query);

            query = mysql.format(dbQuery.UPDATE_PROJECT_AUTHOR, param);
            await service.putData(query);

            req.session.nickname = req.params.nickname; // old => new

            return res.status(200).send(true);
        }
        catch(error) {
            return next(error);
        }
    },
    changeGithubId : async (req, res, next) => {
        if(!req.session.auth)
            return res.status(403).render('login_error');

        try {
            let query = mysql.format(dbQuery.UPDATE_GITHUB_ID, [req.params.github, req.session.nickname]);
            await service.putData(query);

            req.session.github = req.params.github;

            return res.status(200).send(true);
        }
        catch(error) {
            return next(error);
        }
    },
}