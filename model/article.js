module.exports = {
    postData : async function(query, pool) {
        let connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            for(let element of query)
                await connection.query(element);
    
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
    updateData : async function(query, pool) {
        let connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            await connection.query(query);
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
    getData : async function(query, pool) {
        let connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            let data = [];
            for(let element of query) {
                let tmp = await connection.query(element);
                data.push(tmp[0]);
            }
            connection.release();
    
            return Promise.resolve(data);    
        } 
        catch (error) {
            console.log(error);
            connection.release();
    
            return Promise.reject(new Error(error));
        }
    }
};