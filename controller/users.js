const mysql   = require('mysql2');
const dbQuery = require('../model/query');
const service = require('../service/users');
const error = require('./error');

module.exports = {
    getUserGithubId : async (req, res, next) => {
        let nickname = req.params.nickname;
        let query = mysql.format(dbQuery.GET_GITHUB_ID, [nickname]);

        try {
            let data = await service.getData(query);
            console.log(data[0]);

            return res.json(data[0]);
        }
        catch(error) {
            return res.json({'error' : error});
        }
    },
}