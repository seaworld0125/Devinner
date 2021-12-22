const pool = require("../model/db_pool_creater");

module.exports = {
    getData : async (query_) => {
        let connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            let data = await connection.query(query_);
            connection.release();
            
            return Promise.resolve(data[0][0]);
        } 
        catch (error) {
            console.log(error);
            connection.release();
            
            return Promise.reject(new Error(error));
        }
    },
}