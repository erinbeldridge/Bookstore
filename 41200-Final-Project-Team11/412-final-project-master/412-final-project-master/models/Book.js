const mongoDB = require('../services/mongodb');
const sqlDB = require('../services/sqldb');

module.exports = class Book {
    static async getAllBooks(page, callback){
        const limit = 10;
        const offset = (page - 1) * limit;
    
        sqlDB.query(`SELECT * FROM bookstore.books LIMIT ${limit} OFFSET ${offset}`, function(error, results, fields){

            if(error) throw error;
            callback(results);
        });
    }
    static async getBook(key, callback){

        sqlDB.query(`SELECT * FROM bookstore.books where ISBN = ${key}`, function(error, results,fields){
            if(error) throw error;
            return callback(results);
        });  
    }
    static async getReviews(key, callback){
        mongoDB.db.collection('bookReviews').find({"ISBN" : Number(key)}).toArray(function(error, docs) 
        {   
            if(error) throw error;
            callback(docs);
        });        
    }

    static async addReviews(ISBN, userReview,userName,callback){
        mongoDB.db.collection('bookReviews').insertOne({"ISBN" : ISBN,  "userReview" : userReview, "userName": userName}, function(error, docs) 
        {   
            if(error) throw error;
            callback(docs);
        });        
    }
};

