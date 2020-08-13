const sqlDB = require('../services/sqldb');
const mongoDB = require('../services/mongodb');

module.exports = class payments {

    static async create(amount, user, order,book_isbn,address, callback) {
        sqlDB.query(`INSERT INTO orders(order_id,user_id, order_total, order_date, books_ordered,shipping_address)
        VALUES ("${order}", "${user}","${amount}" ,curdate(), "${book_isbn}", "${address}")`, function(error, results, fields){
            if(error) throw error;
            callback(results);
        });
    };

    static async deleteCart(key, callback){
        
        mongoDB.db.collection('cart').deleteMany({"userID" : key} , function(error, docs) 
        {   
            if(error) throw error;
            callback(docs);
        });        
    }

};