'use strict'

class InternalOrderProduct {
    static tableName = 'InternalOrderProduct';
    constructor (id, description, price, qty, SKUId, internalOrder_id) {
        this.id = id;
        this.description = description;
        this.price = price;
        this.qty = qty;   //quantity
        this.SKUId = SKUId;
        this.internalOrder_id = internalOrder_id;
    }
}

module.exports = InternalOrderProduct;