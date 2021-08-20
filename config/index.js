const NEWS_api = require("./api_config");
const DB = require("./db_config");

module.exports = {
    kospi_api_option : NEWS_api.kospi_option,
    db_host : DB.host,
    db_user : DB.user,
    db_password  : DB.password,
    db_database : DB.database,
}