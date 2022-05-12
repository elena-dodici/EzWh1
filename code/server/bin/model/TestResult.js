'use strict'

class TestResult {
    static tableName = 'TestResult';
    constructor (id, rfid,  date, result, idTestDescriptor) {
        this.id = id;
        this.rfid = rfid;
        this.date = date;
        this.result = result;
        this.idTestDescriptor = idTestDescriptor;
    }
}

module.exports = TestResult;