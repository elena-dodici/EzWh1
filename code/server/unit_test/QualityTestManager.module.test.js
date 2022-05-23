
const QualityTestManager = require('../bin/controller/QualityTestManager');
const PersistentManager = require('../bin/DB/PersistentManager');


    //Test defineTestDescriptor Valid
    testDefineTestDescriptorValid("test name","procedure description");

    async function testDefineTestDescriptorValid(name,procedureDescription) {
    describe('define testDescriptor', () => {
 
        beforeEach(async () => {
            //clear DB 
            await PersistentManager.deleteAll("SKU");
            await PersistentManager.deleteAll("TestDescriptor");
        });
       
        test('define testDescriptor valid', async () => {
            //save the related sku_id
            const sku = {description: "description",
                weight: 10,
                volume: 10,
                price: 10, 
                notes: "notes",
                availableQuantity: 10,
                position: null
            }
            let sku_id = await PersistentManager.store("SKU",sku);
            const lastTestDescriptorId = await QualityTestManager.defineTestDescriptor(name,procedureDescription, sku_id);        
            const testDescriptor = await PersistentManager.loadOneByAttribute('id', "TestDescriptor", lastTestDescriptorId);
            const expected = {
                id: lastTestDescriptorId,
                name: name,
                procedureDescription: procedureDescription,
                idSKU: sku_id
            }
            
            expect(testDescriptor).toEqual(expected);
        });

        afterEach(() => {
            PersistentManager.deleteAll("TestDescriptor");
            PersistentManager.deleteAll("SKU");
        });
   
})}
  
    //Test gelAllTestDescriptors
    testgetAllTestDescriptors();

    async function testgetAllTestDescriptors() {
        describe('Test get all testDescriptors', () => { 

        beforeEach(async () => {
            //clear DB 
            await PersistentManager.deleteAll("SKU");
            await PersistentManager.deleteAll("TestDescriptor");
        });
    
        test('get all testDescriptors', async () => {
            
            let testDescriptors_1 = {
                name: "test name 1",
                procedureDescription: "procedure description",
                idSKU: null
            }

            let testDescriptors_2 = {
                name: "test name 2",
                procedureDescription: "procedure description",
                idSKU: null
            }
            await PersistentManager.store("testDescriptor",testDescriptors_1);
            await PersistentManager.store("testDescriptor",testDescriptors_2);
            const list = await QualityTestManager.getAllTestDescriptors();
            testDescriptors_1 = {id:list[0].id,name: "test name 1",procedureDescription: "procedure description",idSKU: null}
            testDescriptors_2 = {id:list[1].id,name: "test name 2",procedureDescription: "procedure description",idSKU: null}
            expect(list).toEqual([testDescriptors_1,testDescriptors_2]);
        })

        afterEach(() => {
            PersistentManager.deleteAll("TestDescriptor");
            PersistentManager.deleteAll("SKU");
        })
    })
    
}

    //Test modifyTestDescriptor
    testmodifyTestDescriptor("new test name","new description");

    async function testmodifyTestDescriptor(newName, newDescription) {
        describe('Test modify testDescriptor', () => { 
        beforeEach(async () => {
            //clear DB 
            await PersistentManager.deleteAll("TestDescriptor");
            await PersistentManager.deleteAll("SKU");
        });
    
        test('modify testDescriptor', async () => {
            const sku = {description: "description",
                weight: 10,
                volume: 10,
                price: 10, 
                notes: "notes",
                availableQuantity: 10,
                position: null
            }
            let id_sku = await PersistentManager.store("SKU",sku);
    
            const testDescriptor = {
                name: "test name",
                procedureDescription: "procedure description",
                idSKU: id_sku
            }
            let test_id = await PersistentManager.store("testDescriptor",testDescriptor);
            await QualityTestManager.modifyTestDescriptor(test_id , newName, newDescription,id_sku);
            const newTestDescriptor = await PersistentManager.loadOneByAttribute('id', "TestDescriptor", test_id);
            const expected = {
                id: test_id,
                name: "new test name",
                procedureDescription: "new description",
                idSKU: id_sku
            }
            expect(newTestDescriptor).toEqual(expected);
        })

        afterEach(() => {
            PersistentManager.deleteAll("TestDescriptor");
            PersistentManager.deleteAll("SKU");
        })
        })
    }

    //Test defineTestResult Valid
    testDefineTestResultValid("12341234123412341234123412341234","2022-01-01",1);

    async function testDefineTestResultValid(rfid,Date,Result) {
        describe('define testResult', () => {

        beforeEach(async () => {
            //clear DB 
            await PersistentManager.deleteAll("TestResult");
            await PersistentManager.deleteAll("TestDescriptor");
            await PersistentManager.deleteAll("SKUItem");
           
        });
       
        test('define testResult valid', async () => {
            const testDescriptor = {
                name: "test name",
                procedureDescription: "procedure description",
                idSKU: null
            }
            const skuItem = {
                RFID: '12341234123412341234123412341234',
                Available: 0,
                DateOfStock: '2022-01-01',
                SKUId: null,
                internalOrder_id: null,
                restockOrder_id: null,
                returnOrder_id: null
            }
            let testDescriptor_id = await PersistentManager.store("testDescriptor",testDescriptor);
            await PersistentManager.store("SKUItem",skuItem);
            const lastTestResultId = await QualityTestManager.defineTestResult(rfid,Date,Result,testDescriptor_id);
            const testResult = await PersistentManager.loadOneByAttribute('id', "TestResult", lastTestResultId);
            const expected = {
                id: lastTestResultId,
                rfid: rfid,
                Date: Date,
                Result: Result,
                idTestDescriptor: testDescriptor_id
            }
            expect(testResult).toEqual(expected);
        });

        afterEach(() => {
            PersistentManager.deleteAll("TestResult");
            PersistentManager.deleteAll("TestDescriptor");
            PersistentManager.deleteAll("SKUItem");
        });
    })
}

    //Test modifyTestResult
    testmodifyTestResult("12341234123412341234123412341234","2022-02-02",0);

    async function testmodifyTestResult(rfid, newDate, newResult) {
        describe('Test modify testResult', () => { 
        beforeEach(async () => {
            //clear DB 
            await PersistentManager.deleteAll("TestResult");
            await PersistentManager.deleteAll("TestDescriptor");
            await PersistentManager.deleteAll("SKUItem");
        });
    
        test('modify testResult', async () => {
            const testDescriptor = {
                name: "test name",
                procedureDescription: "procedure description",
                idSKU: null
            }
            const skuItem = {
                RFID: '12341234123412341234123412341234',
                Available: 0,
                DateOfStock: '2022-01-01',
                SKUId: null,
                internalOrder_id: null,
                restockOrder_id: null,
                returnOrder_id: null
            }
            let testDescriptor_id = await PersistentManager.store("testDescriptor",testDescriptor);
            await PersistentManager.store("SKUItem",skuItem);
            const testResult = {
                rfid: '12341234123412341234123412341234',
                Date: '2022-02-02',
                Result: 1,
                idTestDescriptor: testDescriptor_id
            }
            let test_id = await PersistentManager.store("testResult",testResult);
            await QualityTestManager.modifyTestResultByID(test_id ,rfid, testDescriptor_id, newDate, newResult);
            const newTestResult = await PersistentManager.loadOneByAttribute('id', "TestResult", test_id);
            const expected = {
                id: test_id,
                rfid: rfid,
                Date: newDate,
                Result: newResult,
                idTestDescriptor: testDescriptor_id
            }
            expect(newTestResult).toEqual(expected);
        })

        afterEach(() => {
            PersistentManager.deleteAll("TestResult");
            PersistentManager.deleteAll("TestDescriptor");
            PersistentManager.deleteAll("SKUItem");
        })
    })
    
}
