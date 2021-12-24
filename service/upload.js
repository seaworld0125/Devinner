const pool = require("../model/db_pool_creater");

module.exports = {
    postData : async (query_) => {
        let connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            await connection.query(query_);
            await connection.commit();
            connection.release();
    
            return Promise.resolve();
        }
        catch (error) {
            await connection.rollback();
            connection.release();
    
            return Promise.reject(new Error(error));
        }
    },
}