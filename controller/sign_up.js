const mysql      = require("mysql2");
const dbQuery    = require('../model/query');
const INET       = require('../Helpers/inet');
const hashModule = require('../Helpers/hash_module');
const service    = require('../service/sign_up');
const sanitize_func = require('../Helpers/sanitize_func');

module.exports = {
    getLoginPage : (req, res) => {
        if(req.session.auth)
            return res.status(403).render('login_error');

        return res.status(200).render('sign_up');
    },
    createAccount : async (req, res, next) => {
        if(req.session.auth)
            return res.status(403).render('login_error');
    
        let id = sanitize_func.notAllowedAll(req.body.username);
        let password = sanitize_func.notAllowedAll(req.body.password);
        let nickname = sanitize_func.notAllowedAll(req.body.nickname);
        let ip = INET.aton(sanitize_func.notAllowedAll(req.body.ip));
        let github = sanitize_func.notAllowedAll(req.body.github);

        if(!id || !password || !nickname || !ip) return res.status(303).redirect('/');    
    
        let salt = await hashModule.makeSalt();
        let hashedPassword = await hashModule.makeHashedPassword(salt, password);
    
        let values = [0, id, hashedPassword, salt, nickname, ip, github];
        let query = mysql.format(dbQuery.CREATE_ACCOUNT, values);
    
        try {
            await service.postData(query);
            return res.status(303).redirect('/');
        } 
        catch(error) {
            return next(error);
        }
    },
    checkId : async (req, res) => {
        if(req.session.auth)
            return res.status(403).render('login_error');
        
        let id = req.query.id;
        let query = mysql.format(dbQuery.CHECK_USERNAME, id);

        try {
            let result = await service.getData(query);    
            return res.status(200).send(result ? false : true);
        } 
        catch(error) {
            return next(error);
        }
    },
    checkNickname : async (req, res) => {
        if(req.session.auth)
            return res.status(403).render('login_error');

        let nickname = req.query.nickname;
        let query = mysql.format(dbQuery.CHECK_NICKNAME, nickname);

        try {
            let result = await service.getData(query);    
            return res.status(200).send(result ? false : true);
        } 
        catch(error) {
            return next(error);
        }
    },
};