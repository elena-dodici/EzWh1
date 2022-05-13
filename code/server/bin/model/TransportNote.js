'use strict'

class TransportNote {
    tableName = 'TransportNote'
    constructor (id, deliveryDate) {
        this.id = id;
        this.deliveryDate = deliveryDate;
    }
}

module.exports=TransportNote;