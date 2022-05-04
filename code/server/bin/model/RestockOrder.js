'use strict'

class restockOrder {
    constructor (id, issue_date, state, supplier, transportNote) {
        this.id = id;
        this.issue_date = issue_date;
        this.state = state;
        this.supplier = supplier;
        this.transportNote = transportNote;
    }
}