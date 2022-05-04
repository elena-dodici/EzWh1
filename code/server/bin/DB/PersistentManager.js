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
			db.run(sql, attributesValue, (err) => {
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
}

//Taking advantage of nodeJS caching mechanism returning an instance of the class to implement easily the Singleton pattern
module.exports = new PersistentManager();
