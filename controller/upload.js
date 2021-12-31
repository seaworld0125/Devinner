const mysql    = require("mysql2");
const dbQuery  = require('../model/query');
const service  = require('../service/upload');
const sanitize_func = require('../Helpers/validator');

module.exports = {
    uploadImage : (req, res, next) => {
        let url = '/img/upload/' + sanitize_func.notAllowedAllHtml(req.file.filename);
        res.json({'url' : url});
    },
    uploadProjectPage : (req, res, next) => {
        if(!req.session.auth)
            return res.status(403).render('login_error', {});

        return res.status(200).render('upload_project', {'author' : req.session.nickname, 'github' : (req.session.github ? req.session.github : '')});
    },
    uploadProject : async (req, res, next) => {

        let author = sanitize_func.notAllowedAllHtml(req.body.author);
        let github = sanitize_func.notAllowedAllHtml(req.body.github);
        let repos = sanitize_func.notAllowedAllHtml(req.body.repos);
        let title = sanitize_func.notAllowedAllHtml(req.body.title);
        let desc = sanitize_func.notAllowedAllHtml(req.body.description);
        let img = '/img/upload/' + sanitize_func.notAllowedAllHtml(req.file.filename);

        if(!author || !github || !repos || !title || !desc) return res.status(303).redirect('/project');

        let query = mysql.format(dbQuery.NEW_PROJECT, [author, github, repos, title, desc, img]);
        try {
            await service.postData(query);
            return res.status(303).redirect('/project');
        }
        catch(error) {
            next(error);
        }
    },
};