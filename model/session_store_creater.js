const MySQLStore = require("express-mysql-session")(session);
const config = require('../conf/db');// db 설정 로드

module.exports = new MySQLStore(config.dbOption);