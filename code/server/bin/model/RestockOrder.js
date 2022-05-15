'use strict'

class RestockOrder {
    static tableName = 'RestockOrder';
    constructor (id, issue_date, state, supplier_id, transportNote) {
        this.id = id;
        this.issue_date = issue_date;
        this.state = state;
        this.supplier_id = supplier_id;
        this.transportNote = transportNote;
    }

        //Checks if position ID is in a valid format
   
}

module.exports = RestockOrder;