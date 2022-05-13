'use strict'

class Item {
    static tableName='Item';
    constructor (id, description, price, sku, supplier) {
        
        this.id = id;
        this.description = description; 
        this.price = price;
        this.sku = sku;
        this.supplier = supplier;
    }
}

module.exports= Item;