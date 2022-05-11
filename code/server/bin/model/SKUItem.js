'use strict'

class SKUItem {
    static tableName = 'SKUItem';
    constructor (rfid, available, dateOfStock, relativeSKU, internalOrder, restockOrder, returnOrder, testResult) {
        this.RFID = rfid;
        this.Available = available;
        this.dateOfStock = dateOfStock;
        this.relativeSKU = relativeSKU;
        this.internalOrder = internalOrder; 
        this.restockOrder = restockOrder;
        this.returnOrder = returnOrder;
        this.testResult = testResult;

    }
}

module.exports = SKUItem;