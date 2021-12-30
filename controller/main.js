const dbQuery   = require('../model/query');
const service   = require('../service/main');

const news      = require('../Helpers/today_news');

module.exports = {
    getMainPage : async (req, res, next) => {
        try {
            let list = await service.getData(dbQuery.GET_BOARD_LIST);
            list.sort((a, b) => {
                if(a.group_id == 0) {
                    return 1;
                } else if(b.group_id == 0) {
                    return -1;
                } else {
                    return 0;
                }
            });
            list.reverse();
            console.log(list);

            return res.status(200).render('main', {'board_list' : list, 'session' : (req.session.auth ? req.session : undefined), 'news' : news});
        }
        catch(error) {
            next(error);
        }
    },
}