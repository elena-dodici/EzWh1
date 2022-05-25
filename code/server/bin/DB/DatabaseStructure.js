const sqlite = require("sqlite3");

const sqlUser = `
        CREATE TABLE IF NOT EXISTS "User" (
            "id"	INTEGER NOT NULL UNIQUE,
            "username"	TEXT NOT NULL,
            "password"	TEXT,
            "name"	TEXT,
            "surname"	TEXT,
            "type"	TEXT,
            PRIMARY KEY("id" AUTOINCREMENT)
        );`;
const sqlPosition = `
        CREATE TABLE IF NOT EXISTS "Position" (
            "id"	TEXT NOT NULL UNIQUE,
            "aisle"	TEXT NOT NULL,
            "row"	TEXT NOT NULL,
            "col"	TEXT,
            "max_weight"	NUMERIC,
            "max_volume"	NUMERIC,
            "occupied_weight"	NUMERIC,
            "occupied_volume"	NUMERIC,
            PRIMARY KEY("id")
        );`;
const sqlTN = `
        CREATE TABLE IF NOT EXISTS "TransportNote" (
            "id"	INTEGER NOT NULL UNIQUE,
            "deliveryDate"	TEXT,
            PRIMARY KEY("id" AUTOINCREMENT)
        );`;
const sqlSKU = `
        CREATE TABLE IF NOT EXISTS "SKU" (
            "id"	INTEGER NOT NULL UNIQUE,
            "description"	TEXT,
            "weight"	REAL,
            "volume"	REAL NOT NULL,
            "price"	REAL,
            "notes"	TEXT,
            "availableQuantity"	INTEGER,
            "position"	TEXT,
            FOREIGN KEY("position") REFERENCES "Position"("id") ON UPDATE CASCADE ON DELETE SET NULL,
            PRIMARY KEY("id" AUTOINCREMENT)
        );`;
const sqlTD = `
        CREATE TABLE IF NOT EXISTS "TestDescriptor" (
            "id"	INTEGER NOT NULL UNIQUE,
            "name"	TEXT,
            "procedureDescription"	TEXT,
            "idSKU"	INTEGER,
            FOREIGN KEY("idSKU") REFERENCES "SKU"("id") ON DELETE SET NULL ON UPDATE CASCADE,
            PRIMARY KEY("id" AUTOINCREMENT)
        );`;
const sqlItem = `
        CREATE TABLE IF NOT EXISTS "Item" (
            "id"	INTEGER NOT NULL UNIQUE,
            "description"	TEXT,
            "price"	REAL,
            "SKUId"	INTEGER,
            "supplierId"	INTEGER,
            FOREIGN KEY("SKUId") REFERENCES "SKU"("id") ON UPDATE CASCADE ON DELETE CASCADE,
            FOREIGN KEY("supplierId") REFERENCES "User"("id") ON UPDATE CASCADE ON DELETE SET NULL,
            PRIMARY KEY("id")
        );`;
const sqlRO = `
        CREATE TABLE IF NOT EXISTS "RestockOrder" (
            "id"	INTEGER NOT NULL UNIQUE,
            "issue_date"	NUMERIC,
            "state"	TEXT,
            "supplier_id"	INTEGER,
            "transport_note_id"	INTEGER,
            FOREIGN KEY("transport_note_id") REFERENCES "TransportNote"("id") ON DELETE SET NULL ON UPDATE CASCADE,
            FOREIGN KEY("supplier_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
            PRIMARY KEY("id" AUTOINCREMENT)
        );`;
const sqlReO = `
        CREATE TABLE IF NOT EXISTS "ReturnOrder" (
            "id"	INTEGER NOT NULL UNIQUE,
            "returnDate"	NUMERIC,
            "restockOrder_id"	INTEGER,
            FOREIGN KEY("restockOrder_id") REFERENCES "RestockOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE,
            PRIMARY KEY("id" AUTOINCREMENT)
        );`;

const sqlIO = `
        CREATE TABLE IF NOT EXISTS "InternalOrder" (
            "id"	INTEGER NOT NULL UNIQUE,
            "date"	NUMERIC,
            "state"	TEXT,
            "customer_id"	INTEGER,
            FOREIGN KEY("customer_id") REFERENCES "User"("id") ON UPDATE CASCADE ON DELETE SET NULL,
            PRIMARY KEY("id" AUTOINCREMENT)
        );`;

const sqlPO = `
        CREATE TABLE IF NOT EXISTS "ProductOrder" (
            "id"	INTEGER NOT NULL UNIQUE,
            "quantity"	INTEGER,
            "restockOrder_id"	INTEGER,
            "item_id"	TEXT,
            FOREIGN KEY("restockOrder_id") REFERENCES "RestockOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY("item_id") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE,
            PRIMARY KEY("id" AUTOINCREMENT)
        );`;

const sqlIOP = `
        CREATE TABLE IF NOT EXISTS "InternalOrderProduct" (
            "id"	INTEGER NOT NULL UNIQUE,
            "description"	INTEGER,
            "price"	REAL,
            "quantity"	INTEGER,
            "sku_id"	INTEGER,
            "internalOrder_id"	INTEGER,
            FOREIGN KEY("internalOrder_id") REFERENCES "InternalOrder"("id") ON UPDATE CASCADE ON DELETE SET NULL,
            PRIMARY KEY("id" AUTOINCREMENT)
        );`;

const sqlSKUItem = `
        CREATE TABLE IF NOT EXISTS "SKUItem" (
            "RFID"	TEXT NOT NULL UNIQUE,
            "Available"	INTEGER,
            "DateOfStock"	NUMERIC,
            "SKUId"	INTEGER,
            "internalOrder_id"	INTEGER,
            "restockOrder_id"	INTEGER,
            "returnOrder_id"	INTEGER,
            FOREIGN KEY("internalOrder_id") REFERENCES "InternalOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE,
            FOREIGN KEY("restockOrder_id") REFERENCES "RestockOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE,
            FOREIGN KEY("returnOrder_id") REFERENCES "ReturnOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE,
            PRIMARY KEY("RFID")
        );`;

const sqlTR = `
        CREATE TABLE IF NOT EXISTS "TestResult" (
            "id"	INTEGER NOT NULL UNIQUE,
            "rfid"	TEXT NOT NULL,
            "Date"	NUMERIC,
            "Result"	INTEGER,
            "idTestDescriptor"	INTEGER,
            FOREIGN KEY("idTestDescriptor") REFERENCES "TestDescriptor"("id") ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY("rfid") REFERENCES "SKUItem"("RFID") ON DELETE CASCADE ON UPDATE CASCADE,
            PRIMARY KEY("id" AUTOINCREMENT)
        );`;

exports.createUserTable = function () {
	return new Promise((resolve, reject) => {
		const db = new sqlite.Database("ezwh.db", (err) => {
			if (err) {
				reject(err);
				return;
			}
		});
		db.run(sqlUser, (err) => {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
		db.close();
	});
};

exports.createPositionTable = function () {
	return new Promise((resolve, reject) => {
	
		const db = new sqlite.Database("ezwh.db", (err) => {
			if (err) {
				reject(err);
				return;
			}
		});
		db.run(sqlPosition, (err) => {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
		db.close();
	});
};

exports.createTNTable = function () {
	return new Promise((resolve, reject) => {
	
		const db = new sqlite.Database("ezwh.db", (err) => {
			if (err) {
				reject(err);
				return;
			}
		});
		db.run(sqlTN, (err) => {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
		db.close();
	});
};

exports.createSKUTable = function () {
	return new Promise((resolve, reject) => {
	
		const db = new sqlite.Database("ezwh.db", (err) => {
			if (err) {
				reject(err);
				return;
			}
		});
		db.run(sqlSKU, (err) => {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
		db.close();
	});
};

exports.createTDTable = function () {
	return new Promise((resolve, reject) => {
	
		const db = new sqlite.Database("ezwh.db", (err) => {
			if (err) {
				reject(err);
				return;
			}
		});
		db.run(sqlTD, (err) => {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
		db.close();
	});
};

exports.createItemTable = function () {
	return new Promise((resolve, reject) => {
	
		const db = new sqlite.Database("ezwh.db", (err) => {
			if (err) {
				reject(err);
				return;
			}
		});
		db.run(sqlItem, (err) => {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
		db.close();
	});
};

exports.createROTable = function () {
	return new Promise((resolve, reject) => {
	
		const db = new sqlite.Database("ezwh.db", (err) => {
			if (err) {
				reject(err);
				return;
			}
		});
		db.run(sqlRO, (err) => {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
		db.close();
	});
};


exports.createReOTable = function () {
	return new Promise((resolve, reject) => {
	
		const db = new sqlite.Database("ezwh.db", (err) => {
			if (err) {
				reject(err);
				return;
			}
		});
		db.run(sqlReO, (err) => {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
		db.close();
	});
};

exports.createIOTable = function () {
	return new Promise((resolve, reject) => {
	
		const db = new sqlite.Database("ezwh.db", (err) => {
			if (err) {
				reject(err);
				return;
			}
		});
		db.run(sqlIO, (err) => {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
		db.close();
	});
};

exports.createPOTable = function () {
	return new Promise((resolve, reject) => {
	
		const db = new sqlite.Database("ezwh.db", (err) => {
			if (err) {
				reject(err);
				return;
			}
		});
		db.run(sqlPO, (err) => {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
		db.close();
	});
};

exports.createIOPTable = function () {
	return new Promise((resolve, reject) => {
	
		const db = new sqlite.Database("ezwh.db", (err) => {
			if (err) {
				reject(err);
				return;
			}
		});
		db.run(sqlIOP, (err) => {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
		db.close();
	});
};

exports.createSKUItemTable = function () {
	return new Promise((resolve, reject) => {
	
		const db = new sqlite.Database("ezwh.db", (err) => {
			if (err) {
				reject(err);
				return;
			}
		});
		db.run(sqlSKUItem, (err) => {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
		db.close();
	});
};

exports.createTRTable = function () {
	return new Promise((resolve, reject) => {
	
		const db = new sqlite.Database("ezwh.db", (err) => {
			if (err) {
				reject(err);
				return;
			}
		});
		db.run(sqlTR, (err) => {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
		db.close();
	});
};