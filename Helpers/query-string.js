module.exports = {
    CHECK_USERNAME : 'SELECT account_name FROM account WHERE account_name = ?',
    CHECK_NICKNAME : 'SELECT nickname FROM account WHERE nickname = ?',
    CHECK_ACCOUNT : 'SELECT * FROM account WHERE account_name = ?',
    CHECK_IP : 'SELECT account_name FROM account WHERE ip_address = ?',
    CREATE_ACCOUNT : 'INSERT INTO account VALUE(?, ?, ?, ?, ?)',
    CHECK_BAN_LIST : 'SELECT ip FROM ban_list WHERE ip = ?',
    SET_NICKNAME : 'UPDATE account SET nickname=? WHERE nickname=?',
};