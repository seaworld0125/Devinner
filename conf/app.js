const NEWS_api = require("./news-api");
const DB = require("./db");

module.exports = {
    kospi_option : NEWS_api.kospi_option,
    db_host : DB.host,
    db_user : DB.user,
    db_password  : DB.password,
    db_database : DB.database,
}