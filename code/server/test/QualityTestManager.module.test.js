
const QualityTestManager = require('../bin/controller/QualityTestManager');
const PersistentManager = require('../bin/DB/PersistentManager');


    //Test defineTestDescriptor Valid
    testDefineTestDescriptorValid("test name","procedure description");

    async function testDefineTestDescriptorValid(name,procedureDescription) {
    describe('define testDescriptor', () => {
        let sku_id = null;
 
        beforeEach(async () => {
            //clear DB 
            await PersistentManager.deleteAll("SKU");
            await PersistentManager.deleteAll("TestDescriptor");
            //save the related sku_id
            const sku = {description: "description",
                weight: 10,
                volume: 10,
                price: 10, 
                notes: "notes",
                availableQuantity: 10,
                position: null
            }
            sku_id = await PersistentManager.store("SKU",sku);
        });
       
        test('define testDescriptor valid', async () => {
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
  
    //Test defineTestDescriptor Invalid : idSKU not existing
    testDefineTestDescriptorInvalid("test name","procedure description", 1000);

    async function testDefineTestDescriptorInvalid(name,procedureDescription,idSKU) {
        describe('define testDescriptor invalid', () => {
   
        beforeEach(async () => {
            //clear DB 
            await PersistentManager.deleteAll("SKU");
            await PersistentManager.deleteAll("TestDescriptor");
        });

        test('define testDescriptor invalid', async () => {
            //id = await QualityTestManager.defineTestDescriptor(name,procedureDescription,idSKU);
            //console.log(id);
            return expect(QualityTestManager.defineTestDescriptor(name,procedureDescription,idSKU)).toEqual({});
        });
    })
    }



describe('Test get all testDescriptors', () => { 

    //Test gelAllTestDescriptors
    testgetAllTestDescriptors();

    async function testgetAllTestDescriptors() {

        beforeEach(async () => {
            //clear DB 
            await PersistentManager.deleteAll("SKU");
            await PersistentManager.deleteAll("TestDescriptor");

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
        });
    
        test('get all testDescriptors', async () => {
            const list = await QualityTestManager.getAllTestDescriptors();
            testDescriptors_1 = {id:list[0].id,name: "test name 1",procedureDescription: "procedure description",idSKU: null}
            testDescriptors_2 = {id:list[1].id,name: "test name 2",procedureDescription: "procedure description",idSKU: null}
            expect(list).toEqual([testDescriptors_1,testDescriptors_2]);
        })

        afterEach(() => {
            PersistentManager.deleteAll("TestDescriptor");
            PersistentManager.deleteAll("SKU");
        })
    }
    
});

describe('define testResult', () => {

    //Test defineTestDescriptor Valid
    testDefineTestResultValid("12341234123412341234123412341234","2022-01-01",true, 1);

    let testDescriptor_id = null;

    async function testDefineTestResultValid(rfid,Date,Result,idTestDescriptor) {
        beforeEach(async () => {
            //clear DB 
            await PersistentManager.deleteAll("TestResult");
            await PersistentManager.deleteAll("TestDescriptor");
            await PersistentManager.deleteAll("SKUItem");
            //save the related sku_id
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
            testDescriptor_id = await PersistentManager.store("testDescriptor",testDescriptor);
            await PersistentManager.store("SKUItem",skuItem);
        });
       
        test('define testResult valid', async () => {
            const lastTestResultId = await QualityTestManager.defineTestResult(rfid,Date,Result,idTestDescriptor);
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
    }
});

describe('Test modify testResult', () => { 

    //Test modifyTestResult
    testmodifyTestResult(1,"12341234123412341234123412341234",1,"2022-02-02",false);

    async function testmodifyTestResult(TestId,rfid, newIdTestDescriptor, newDate, newResult) {

        beforeEach(async () => {
            //clear DB 
            await PersistentManager.deleteAll("TestResult");
            await PersistentManager.deleteAll("TestDescriptor");
            await PersistentManager.deleteAll("SKUItem");
            const testResult = {
                rfid: '12341234123412341234123412341234',
                Date: '2022-02-02',
                Result: true,
                idTestDescriptor: 1
            }
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
            await PersistentManager.store("testResult",testResult);
            await PersistentManager.store("testDescriptor",testDescriptor);
            await PersistentManager.store("SKUItem",skuItem);
        });
    
        test('modify testResult', async () => {
            const lastTestResultId = await QualityTestManager.modifyTestResult(TestId,rfid, newIdTestDescriptor, newDate, newResult);
            const newTestResult = await PersistentManager.loadOneByAttribute('id', "TestResult", lastTestResultId);
            const expected = {
                id: lastTestResultId,
                rfid: rfid,
                Date: newDate,
                Result: newResult,
                idTestDescriptor: newIdTestDescriptor
            }
            expect(newTestResult).toEqual(expected);
        })

        afterEach(() => {
            PersistentManager.deleteAll("TestResult");
            PersistentManager.deleteAll("TestDescriptor");
            PersistentManager.deleteAll("SKUItem");
        })
    }
    
});
