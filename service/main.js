const pool = require('../model/db_pool_creater');

module.exports = {
    getData : async function(query) {
        let connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            let data = await connection.query(query);
            connection.release();
    
            return Promise.resolve(data[0]);    
        } 
        catch (error) {
            console.log(error);
            connection.release();
    
            return Promise.reject(new Error(error));
        }
    }
};