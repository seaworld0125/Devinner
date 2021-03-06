const mysql      = require("mysql2");
const dbQuery    = require('../model/query');
const hashModule = require('../Helpers/hash_module');
const service    = require('../service/auth');

module.exports = {
    login : async (req, res, next) => {
        if(!req.body.id || !req.body.password) return res.status(303).redirect('back');

        let id = req.body.id.replace(/<[^>]+>/g, '');
        let password = req.body.password.replace(/<[^>]+>/g, '');
        let query = mysql.format(dbQuery.CHECK_ACCOUNT, [id]);

        try {
            let result = await service.getData(query);

            if(!result) return res.status(303).redirect('back');

            let hashedPassword = await hashModule.makeHashedPassword(result.salt, password);
            if(hashedPassword === result.password) {
                req.session.auth = true;
                req.session.nickname = result.nickname;
                req.session.level = result.level;
                req.session.github = result.github_id;
                req.session.manager = (result.manager === 'Y' ? true : false);

                req.session.save((err) => {
                    if(err) throw err;
                    return res.status(303).redirect('back');
                });
            }
            else res.status(303).redirect('back');
        }
        catch(error) {
            next(error);
        }
    },
    logout : async (req, res, next) => {
        req.session.destroy(error => {
            if (error) 
                next(error);
            else 
                return res.status(303).redirect('back');
        });
    },
}
