'use strict'

class Item {
    static tableName='Item';
    constructor (id, description, price, SKUId, supplierId) {
        
        this.id = id;
        this.description = description; 
        this.price = price;
        this.SKUId = SKUId;
        this.supplierId = supplierId;
    }
}

module.exports= Item;