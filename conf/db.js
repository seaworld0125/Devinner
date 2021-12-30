module.exports = {
    poolOption : {
        host: process.env.POOL_HOST,
        port: process.env.POOL_PORT,
        user: process.env.POOL_USER,
        password: process.env.POOL_PASSWORD,
        database: process.env.POOL_DATABASE,
        multipleStatements: false,
        connectionLimit : 30, // 커넥션수
        dateStrings: 'date'
    },
    dbOption : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    }
}