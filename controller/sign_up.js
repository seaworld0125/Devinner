const mysql      = require("mysql2");
const dbQuery    = require('../model/query');
const INET       = require('../Helpers/inet');
const hashModule = require('../Helpers/hash_module');
const service    = require('../service/sign_up');

module.exports = {
    getLoginPage : (req, res) => {
        res.status(200).render(req.session.auth ? 'login_error' : 'sign_up');
    },
    createAccount : async (req, res, next) => {
        if(req.session.auth) return res.status(200).render('login_error');
    
        let id = req.body.username;
        let password = req.body.password;
        let nickname = req.body.nickname;
        let ip = INET.aton(req.body.ip);
        let github = req.body.github;
    
        let salt = await hashModule.makeSalt();
        let hashedPassword = await hashModule.makeHashedPassword(salt, password);
    
        let values = [0, id, hashedPassword, salt, nickname, ip, github];
        let query = mysql.format(dbQuery.CREATE_ACCOUNT, values);
    
        try {
            await service.postData(query);

            return res.status(303).redirect('/');
        } 
        catch(error) {
            next(error);
        }
    },
    checkId : async (req, res) => {
        if(req.session.auth)
            return res.status(200).render('login_error');
        
        let id = req.query.id;
        let query = mysql.format(dbQuery.CHECK_USERNAME, id);

        try {
            let result = await service.getData(query);    

            return res.send(result ? false : true).end();
        } 
        catch(error) {
            return res.send(error);
        }
    },
    checkNickname : async (req, res) => {
        if(req.session.auth)
            return res.status(200).render('login_error');

        let nickname = req.query.nickname;
        let query = mysql.format(dbQuery.CHECK_NICKNAME, nickname);

        try {
            let result = await service.getData(query);    

            return res.send(result ? false : true).end();
        } 
        catch(error) {
            return res.send(error);
        }
    },
};