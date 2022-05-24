const Item = require('../model/Item');
const User = require('../model/User');
const PersistentManager = require('../DB/PersistentManager');
const SKU = require("../model/SKU");
const { Test } = require('mocha');


class ItemManager {

    constructor() {}

    async defineItem(id, description, price, SKUId,supplierId) {
        
        let i = new Item(id,description, price, SKUId,supplierId); 
        
        let loadedSKU = await PersistentManager.loadOneByAttribute("id",SKU.tableName, SKUId);
        if (!loadedSKU) {
            return Promise.reject("404 SKU not found");
        }
        let loadedUser = await PersistentManager.loadOneByAttribute("id",User.tableName,supplierId);
        if (!loadedUser || loadedUser.type.toLowerCase() != 'supplier') {
            return Promise.reject("404 Supplier not found");
        }
        let loadedItem = await PersistentManager.loadOneByAttribute("id",Item.tableName, id);
        if(loadedItem){
            if(loadedItem.supplierId == supplierId){
                return Promise.reject("422 supplier already sells an Item with the same ID");
            }
        }
        let listSameSKUId = await PersistentManager.loadFilterByAttribute(Item.tableName,"SKUId",SKUId);
        if(listSameSKUId){
            for (let i = 0; i < listSameSKUId.length; i++) {
                if(listSameSKUId[i].supplierId == supplierId){
                 return Promise.reject("422 this supplier already sells an item with the same SKUId"); 
                }
              }
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
        /*
        if (!exists){
            return Promise.reject("404");
        }*/
        return PersistentManager.delete('id', ItemId, Item.tableName);
        
    }

}


module.exports = new ItemManager();