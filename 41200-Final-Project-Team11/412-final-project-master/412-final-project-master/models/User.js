const dbService = require('../services/mongodb');

class User {
    constructor(userData){
        this.id = userData.id;
        this.givenName = userData.name.givenName;
        this.familyName = userData.name.familyName;
        this.userImage = userData.photos[0].value;
        this.email = userData.emails[0].value;
    }
    static async addUser(userData) {
        const newUser = await dbService.db.collection('users').insertOne(userData);
        return newUser;
    }
    static async checkUserExists(userID){
        const result = await dbService.db.collection('users').find({id: userID}).toArray();
        if(result.length > 0){
            return true
        } else {
            return false;
        }
    }
}

module.exports = User;

