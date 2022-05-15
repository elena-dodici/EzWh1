'use strict'

class User {
    static tableName='User';

    constructor (id, username, password, name, surname, email, type ){
        this.id = id;
        this.username = username;
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.type = type;
    }
}


module.exports = User;