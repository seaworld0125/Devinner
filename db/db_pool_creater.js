const mysql = require("mysql2/promise");
const config = require('../conf/db');// db 설정 로드

module.exports = mysql.createPool(config.poolOption);
