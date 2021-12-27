const mysql    = require("mysql2");
const dbQuery  = require('../model/query');
const service  = require('../service/upload');

module.exports = {
    uploadImage : (req, res, next) => {
        let url_ = '/img/upload/' + req.file.filename;
        res.json({url : url_});
    },
    uploadProjectPage : (req, res, next) => {
        let page = (req.session.auth ? 'upload_project' : 'login_error');
        let author = req.session.nickname;
        let github = (req.session.github ? req.session.github : '');

        return res.status(200).render(page, {'author' : author, 'github' : github});
    },
    uploadProject : async (req, res, next) => {
        let author = req.body.author;
        let github = req.body.github;
        let repos = req.body.repos;
        let title = req.body.title;
        let desc = req.body.description;
        let img = '/img/upload/' + req.file.filename;

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