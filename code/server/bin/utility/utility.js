'use strict'

const UserManager = require("../controller/UserManager");
const PersistentManager = require("../DB/PersistentManager");

exports.renameKey = function (o, old_key, new_key) {
    if (old_key !== new_key) {
        Object.defineProperty(o, new_key,
            Object.getOwnPropertyDescriptor(o, old_key));
        delete o[old_key];
    }
}

/*
Password is always: testpassword
Customer: user1@ezwh.com
Quality Employee: qualityEmployee1@ezwh.com
Clerk: clerk1@ezwh.com
Delivery Employee: deliveryEmployee1@ezwh.com
Supplier: supplier1@ezwh.com
Manager: manager1@ezwh.com
*/

exports.initializeDB = function() {
    PersistentManager.deleteAll('InternalOrder');
    PersistentManager.deleteAll('InternalOrderProduct');
    PersistentManager.deleteAll('Item');
    PersistentManager.deleteAll('Position');
    PersistentManager.deleteAll('ProductOrder');
    PersistentManager.deleteAll('RestockOrder');
    PersistentManager.deleteAll('ReturnOrder');
    PersistentManager.deleteAll('SKU');
    PersistentManager.deleteAll('SKUItem');
    PersistentManager.deleteAll('TestDescriptor');
    PersistentManager.deleteAll('TestResult');
    PersistentManager.deleteAll('TransportNote');
    PersistentManager.deleteAll('User');
    UserManager.defineUser('John','Smith','testpassword', 'user1@ezwh.com', 'customer');;
    UserManager.defineUser('John','Smith','testpassword', 'qualityEmployee1@ezwh.com', 'qualityEmployee');
    UserManager.defineUser('John','Smith','testpassword', 'clerk1@ezwh.com', 'clerk');
    UserManager.defineUser('John','Smith','testpassword', 'deliveryEmployee1@ezwh.com', 'deliveryEmployee');
    UserManager.defineUser('John','Smith','testpassword', 'supplier1@ezwh.com', 'supplier');
    UserManager.defineUser('John','Smith','testpassword', 'manager1@ezwh.com', 'manager');
}