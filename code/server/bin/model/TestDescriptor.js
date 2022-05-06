'use strict'

class TestDescriptor {
    static tableName = 'TestDescriptor';
    constructor (id, name, procedureDescription, sku_id) {
        this.id = id;
        this.name = name;
        this.procedureDescription = procedureDescription;
        this.sku = sku;
    }
}

module.exports = TestDescriptor;