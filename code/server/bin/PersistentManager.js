const sqlite = require('sqlite3');

class PersistentManager {
    
    constructor() {
        this.dbName = "ezwh.db";
    }

    store (object) {
        
        //Table name of the object passed
        const tableName = object.constructor.tableName;
        
        //names of the attributes of the objects
        let attributesName = [];
        //Values of the attributes
        let attributesValue = [];
        
        //Loop through all the object attributes and push them into the arrays
        for (var prop in object) {
            if (Object.prototype.hasOwnProperty.call(object, prop)) {
                
                attributesName.push(prop);
                attributesValue.push(object[prop]);
                
            }
        }

        const placeHoldersArray = attributesName.map( (val) => "?");
        const sql = "INSERT INTO " + tableName + "(" + attributesName.join(",") + ") VALUES (" + placeHoldersArray.join(",") + ")";
        //const sql = "INSERT INTO " + tableName + " VALUES (?,?)"
        

        const db = new sqlite.Database(this.dbName, (err) => { if (err) throw err;});
        db.run(sql, attributesValue, (err) => {if (err) throw err;})
        
        
    }

}


//Taking advantage of nodeJS caching mechanism returning an instance of the class to implement easily the Singleton pattern
module.exports = new PersistentManager();