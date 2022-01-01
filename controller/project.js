const service = require('../service/project');
const dbQuery = require('../model/query');
const mysql = require('mysql2');

module.exports = {
    getProjectPage : async (req, res, next) => {
        try {
            let projects = await service.getData(dbQuery.GET_PROJECTS);
            return res.status(200).render("project", {'session' : (req.session.auth ? req.session : undefined), "projects" : projects});
        }
        catch(error) {
            next(error);
        }
    },
    getUserProject : async (req, res, next) => {
        try {
            let query = mysql.format(dbQuery.GET_USER_PROJECTS, [req.params.user]);
            let projects = await service.getData(query);
            return res.status(200).json(projects);
        }
        catch(error) {
            next(error);
        }
    },
    deleteProject : async (req, res, next) => {
        try {
            for (let i = 0; i < req.body.list.length; i++) {
                let query = mysql.format(dbQuery.GET_USER_PROJECT_BY_ID, [Number(req.body.list[i])]);

                query = mysql.format(dbQuery.DELETE_PROJECT, [Number(req.body.list[i])]);
                await service.postData(query);
            }
            return res.status(200).end();
        }
        catch(error) {
            next(error);
        }
    },
}