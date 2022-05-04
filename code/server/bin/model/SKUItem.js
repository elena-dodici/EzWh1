'use strict'

class SKUItem {
    constructor (rfid, available, date_of_stock, relativeSKU, internalOrder, restockOrder, returnOrder, testResult) {
        this.rfid = rfid;
        this.available = available;
        this.date_of_stock = date_of_stock;
        this.relativeSKU = relativeSKU;
        this.internalOrder = internalOrder; 
        this.restockOrder = restockOrder;
        this.returnOrder = returnOrder;
        this.testResult = testResult;

    }
}