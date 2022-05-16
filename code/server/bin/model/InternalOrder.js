'use strict'

class InternalOrder {
    static tableName = 'InternalOrder';
    constructor ( id, issueDate, state, customerId ) {
        this.id = id;
        this.issueDate = issueDate;
        this.state = state; 
        this.customerId = customerId;
    }
}

module.exports = InternalOrder;