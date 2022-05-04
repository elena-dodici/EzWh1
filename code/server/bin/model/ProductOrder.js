'use strict'

class ProductOrder {
    constructor (id, quantity, restockOrder, item) {
        this.id = id;
        this.quantity = quantity;
        this.restockOrder = restockOrder;
        this.item = item;
    }
}