const TestDescriptor = require('../model/TestDescriptor');
const TestResult = require('../model/TestResult');
const PersistentManager = require('../DB/PersistentManager');
const SKUManager = require('../controller/SKUManager')


class QualityTestManager {

    constructor() {}

    ///TEST DESCRIPTOR///

    defineTestDescriptor(name, procedureDescription, idSKU) {
        
        let t = new TestDescriptor(null,name, procedureDescription, idSKU); 
        //TestDescriptor id is autoincremented
        delete t.id;
        let loadedSKU = SKUManager.getSKUByID(idSKU);
        if (loadedSKU) {
             return PersistentManager.store(TestDescriptor.tableName, t); 
        }
        else {
            return Promise.reject("idSKU not found")
        }
    }

   async getAllTestDescriptors() {
        let tests = PersistentManager.loadAllRows(TestDescriptor.tableName);
        return tests;
    }

    async getTestDescriptorByID(TestId) {
        return PersistentManager.loadOneByAttribute('id', TestDescriptor.tableName, TestId);
    }

    async modifyTestDescriptor(TestId, newName, newProcedureDescription, newIdSKU) {
        let loadedTestDescriptor = await  this.getTestDescriptorByID(TestId);
        if (loadedTestDescriptor) {
            let testToUpdate = {
                name: newName,
                procedureDescription: newProcedureDescription,
                idSKU: newIdSKU,
             }
            let loadedSKU = await SKUManager.getSKUByID(newidSKU);
            if (loadedSKU) {
                return PersistentManager.update(TestDescriptor.tableName, testToUpdate, 'id', TestId);
            }
            else {
               return Promise.reject("idSKU not found")
            }
        }
        else {
            return Promise.reject("not found")
        }
    }

    
    async deleteTestDescriptor(TestId) {
        let loadedTestDescriptor = await this.getTestDescriptorByID(TestId);
        if (!loadedTestDescriptor){
            return Promise.reject("TestDescriptor not existing");
        }
        return PersistentManager.delete('id', TestId, TestDescriptor.tableName);
        
     }


     ///TEST RESULT///

     defineTestResult(rfid,date,result,idTestDescriptor) {
        
        let t = new TestResult(null,rfid,date,result,idTestDescriptor); 
        //TestResult id is autoincremented
        delete t.id;

        let loadedTestDescriptor = this.getTestDescriptorByID(idTestDescriptor);
        if (loadedTestDescriptor) {
            //RFID CHECK ON SKUITEMMANAGER
            return PersistentManager.store(TestResult.tableName, t); 
        }
        else {
            return Promise.reject("idTestDescriptor not found")
        }
    }

    async getAllTestResultsByRFID(rfid) {     
        return PersistentManager.loadFilterByAttribute(TestResult.tableName, 'rfid', rfid);
    }

    async getTestResultrByID(TestId,rfid) {
        return PersistentManager.loadFilterByAttribute(TestResult.tableName,["rfid","id"],[rfid,TestId]);
    }

    async modifyTestResultByID(TestId,rfid, newResult, newDate, newidTestDescriptor) {
        let loadedTestResults = await PersistentManager.loadFilterByAttribute(TestResult.tableName,["rfid","id"],[rfid,TestId]);
        if (loadedTestResults) {
            let testToUpdate = {
                result: newResult,
                date: newDate,
                idTestDescriptor: newidTestDescriptor,
            }
            let loadedTestDescriptor = await this.getTestDescriptorByID(newidTestDescriptor);
            if (loadedTestDescriptor) {
                return PersistentManager.update(TestResult.tableName, testToUpdate, 'id', TestId);
            }
            else {
                return Promise.reject("idTestDescriptor not found")
            }
        }
        else {
            return Promise.reject("not found")
        }
    }

    
    async deleteTestResult(TestId,rfid) {
        let loadedTestResults = await PersistentManager.loadFilterByAttribute(TestResult.tableName,["rfid","id"],[rfid,TestId]);
        if (!loadedTestResults){
            return Promise.reject("TestResult not existing");
        }     
         return PersistentManager.delete('id', TestId, TestResult.tableName);
     }
}


module.exports = new QualityTestManager();