const sqlite = require("sqlite3");

class PersistentManager {
	constructor() {
		this.dbName = "ezwh.db";
	}

	store(tableName, object) {
		return new Promise((resolve, reject) => {
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

			const placeHoldersArray = attributesName.map((val) => "?");
			const sql =
				"INSERT INTO " +
				tableName +
				"(" +
				attributesName.join(",") +
				") VALUES (" +
				placeHoldersArray.join(",") +
				")";
			//const sql = "INSERT INTO " + tableName + " VALUES (?,?)"

			const db = new sqlite.Database(this.dbName, (err) => {
				if (err) {
					reject(err);
					return;
				}
			});
			db.get("PRAGMA foreign_keys = ON");
			db.run(sql, attributesValue, function(err) {
				if (err) {
					reject(err);
					return;
				}
				resolve(this.lastID);
			});
			db.close();
		});
	}

	loadAllRows(tableName) {
		return new Promise((resolve, reject) => {
			const sql = "SELECT * FROM " + tableName;
			const db = new sqlite.Database(this.dbName, (err) => {
				if (err) {
					reject(err);
					return;
				}
			});
			db.get("PRAGMA foreign_keys = ON");
			db.all(sql, (err, rows) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(rows);
			});
			db.close();
		});
	}

	async loadAllRowsSelected(tableName, selectedAttributes) {
		return new Promise((resolve, reject) => {
			const selected = selectedAttributes.join(',');
			const sql = "SELECT " + selected + " FROM " + tableName;
			const db = new sqlite.Database(this.dbName, (err) => {if (err) reject(err) });
			db.get("PRAGMA foreign_keys = ON");
            db.run(sql, (err,rows) => {if (err) reject(err); resolve(rows); } )
            db.close();
		})
	}

    async delete(attribute_name ,id, tableName) {
        return new Promise ((resolve, reject) => {
            const sql = "DELETE FROM " + tableName + " WHERE "+ attribute_name + "= ?";
            const db = new sqlite.Database(this.dbName, (err) => {if (err) reject(err) });
			db.get("PRAGMA foreign_keys = ON");
            db.run(sql, id, (err) => {if (err) reject(err); resolve(); } )
            db.close();
        })
    }

    async loadOneByAttribute(parameter_name, tableName, value ){
        return new Promise ((resolve, reject) => {
            const sql = "SELECT * FROM " + tableName + " WHERE " + parameter_name + "= ?";
            const db = new sqlite.Database(this.dbName, (err) => {if (err) reject(err) });
			db.get("PRAGMA foreign_keys = ON");
            db.get(sql, value, (err, row) => {if (err) reject(err); resolve(row); } )
            db.close();
        })
    }


    async update(tableName, object, attribute_name, id) {
        return new Promise ((resolve, reject) => {
            //names of the attributes of the objects
			let attributesName = [];
			//Values of the attributes
			let attributesValue = [];

			//Loop through all the object attributes and push them into the arrays
			for (var prop in object) {
				if (Object.prototype.hasOwnProperty.call(object, prop)) {
					attributesName.push(prop + "= ?");
					attributesValue.push(object[prop]);
				}
			}


            const sql = "UPDATE " + tableName +
                        " SET " + attributesName.join(",") + 
                        " WHERE " + attribute_name + " = ?";

            const db = new sqlite.Database(this.dbName, (err) => {if (err) reject(err) });
			db.get("PRAGMA foreign_keys = ON");
            db.run(sql, [...attributesValue, id], (err) => {
                if (err) reject(err);
                resolve();
            });
            
        }) 
    }


    async loadFilterByAttribute(tableName, parameterName, value) {
        return new Promise ((resolve, reject) => {
            const sql = "SELECT * FROM " + tableName + " WHERE " + parameterName + "= ?";
            const db = new sqlite.Database(this.dbName, (err) => {if (err) reject(err) });
			db.get("PRAGMA foreign_keys = ON");
            db.all(sql, value, (err,rows) => {if (err) reject(err); resolve(rows); } )
            db.close();
        })
    }

	async loadByMoreAttributes(tableName, parametersName, values) {
		return new Promise ((resolve, reject) => {
			const placeHolders = parametersName.map( v => {
				return v + " = ?"
			})
			const sql = "SELECT * FROM " + tableName + " WHERE " + placeHolders.join(' AND ');
			const db = new sqlite.Database(this.dbName, (err) => {if (err) reject(err) });
			db.get("PRAGMA foreign_keys = ON");
			db.all(sql, values, (err,rows) => {if (err) reject(err); resolve(rows); } );
			db.close();
		})
	}

	
	async loadOneByAttributeSelected(tableName, parameter_name, value, selectedNames) {
		return new Promise ((resolve, reject) => {
			const selectedAttributes = selectedNames.join(',');
			const sql = "SELECT " + selectedAttributes + " FROM " + tableName + " WHERE " + parameter_name + "= ?";
			console.log(sql);
            const db = new sqlite.Database(this.dbName, (err) => {if (err) reject(err) });
			db.get("PRAGMA foreign_keys = ON");
            db.get(sql, value, (err, row) => {if (err) reject(err); resolve(row); } )
            db.close();
		})
	}

	async exists(tableName, parameter_name, value) {
		try {
			let row = await this.loadOneByAttribute(parameter_name, tableName, value);
			if (row) {
				return true;
			}
			else {
				return false;
			}
		}
		catch (err) {
			return Promise.reject(err);
		}
	}
}

//Taking advantage of nodeJS caching mechanism returning an instance of the class to implement easily the Singleton pattern
module.exports = new PersistentManager();
