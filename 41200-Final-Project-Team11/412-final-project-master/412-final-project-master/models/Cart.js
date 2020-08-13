
const mongoDB = require('../services/mongodb');

module.exports = class Cart {
    static async createCart(userID){
        const newCart =await mongoDB.db.collection('cart').insertOne({"userID": userID});
        return newCart;
    }
    static async getCart(userID){  
        let cart = await mongoDB.db.collection('cart').find({"userID": userID}).toArray();
        return cart;
    }
}