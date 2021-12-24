const service = require('../service/project');
const dbQuery = require('../model/query');
const mysql = require('mysql2');

module.exports = {
    getProjectPage : async (req, res, next) => {
        try {
            let projects = await service.getData(dbQuery.GET_PROJECTS);
            res.status(200).render("project", {"session" : (req.session.auth ? req.session : undefined), "projects" : projects});
        }
        catch(error) {
            next(error);
        }
    },
    getUserProject : async (req, res, next) => {
        try {
            let query = mysql.format(dbQuery.GET_USER_PROJECTS, [req.params.user]);
            let projects = await service.getData(query);
            res.status(200).json(projects);
        }
        catch(error) {
            next(error);
        }
    },
}