module.exports = {
    getBoardList : async function(query, pool) {
        let connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            let data = await connection.query(query);
            connection.release();
    
            return Promise.resolve(data[0].reverse());    
        } 
        catch (error) {
            console.log(error);
            connection.release();
    
            return Promise.reject(new Error(error));
        }
    }
};