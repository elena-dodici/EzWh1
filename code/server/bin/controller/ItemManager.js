const Item = require('../model/Item');
const User = require('../model/User');
const PersistentManager = require('../DB/PersistentManager');
const SKU = require("../model/SKU");
const { Test } = require('mocha');


class ItemManager {

    constructor() {}

    async defineItem(description, price, SKUId,supplierId) {
        
        let i = new Item(null,description, price, SKUId,supplierId); 
        //Item id is autoincremented
        delete i.id;
        let existsSKU = await PersistentManager.exists(SKU.tableName, 'id', SKUId);
        if (!existsSKU) {
            return Promise.reject("404 SKU not found");
        }
        let loadedUser = await PersistentManager.loadOneByAttribute("id",User.tableName,supplierId);
        if (!loadedUser || loadedUser.type.toLowerCase() != 'supplier') {
            return Promise.reject("404 Supplier not found");
        }
        return PersistentManager.store(Item.tableName, i); 
    }

   async getAllItems() {
        let items = PersistentManager.loadAllRows(Item.tableName);
        return items;
    }

    async getItemByID(ItemId) {
        return PersistentManager.loadOneByAttribute('id', Item.tableName, ItemId);
    }

    async modifyItem(ItemId, newDescription, newPrice) {
        const exists = await PersistentManager.exists(Item.tableName, 'id', ItemId);
        if (exists) {
            let itemToUpdate = {
                description: newDescription,
                price: newPrice,
            }
            return PersistentManager.update(Item.tableName, itemToUpdate, 'id', ItemId);
        }
        else {
            return Promise.reject("404")
        }
    }

    
    async deleteItem(ItemId) {
        const exists = await PersistentManager.exists(Item.tableName, 'id', ItemId);
        if (!exists){
            return Promise.reject("404");
        }
        return PersistentManager.delete('id', ItemId, Item.tableName);
        
    }

}


module.exports = new ItemManager();