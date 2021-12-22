const pool = require('../model/db_pool_creater');

module.exports = {
    postData : async function(query_) {
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
    updateData : async function(query_) {
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
    getData : async function(query_) {
        let connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            let data = await connection.query(query_);
            connection.release();

            return Promise.resolve(data[0]);    
        } 
        catch (error) {
            connection.release();

            return Promise.reject(new Error(error));
        }
    }
};