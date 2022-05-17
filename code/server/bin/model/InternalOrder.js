'use strict'

class InternalOrder {
    static tableName = 'InternalOrder';
    constructor ( id, date, state, customer_id ) {
        this.id = id;
        this.date = date;
        this.state = state; 
        this.customer_id = customer_id;
    }
}

module.exports = InternalOrder;