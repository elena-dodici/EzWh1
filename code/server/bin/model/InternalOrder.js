'use strict'

class InternalOrder {
    static tableName = 'InternalOrder';
    constructor ( id,date, state, customerId ) {
        this.id = id;
        this.date = date;
        this.state = state; 
        this.customerId = customerId;
    }
}

module.exports = InternalOrder;