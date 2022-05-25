
const QualityTestManager = require('../bin/controller/QualityTestManager');
const PersistentManager = require('../bin/DB/PersistentManager');
const utility = require("../bin/utility/utility");


    //Test defineTestDescriptor Valid
    testDefineTestDescriptorValid("test name","procedure description");

    async function testDefineTestDescriptorValid(name,procedureDescription) {
    describe('define testDescriptor', () => {
 
        beforeEach(async () => {
            //clear DB 
            await PersistentManager.deleteAll('InternalOrder');
    await PersistentManager.deleteAll('InternalOrderProduct');
    await PersistentManager.deleteAll('Item');
    await PersistentManager.deleteAll('Position');
    await PersistentManager.deleteAll('ProductOrder');
    await PersistentManager.deleteAll('RestockOrder');
    await PersistentManager.deleteAll('ReturnOrder');
    await PersistentManager.deleteAll('SKU');
    await PersistentManager.deleteAll('SKUItem');
    await PersistentManager.deleteAll('TestDescriptor');
    await PersistentManager.deleteAll('TestResult');
    await PersistentManager.deleteAll('TransportNote');
    await PersistentManager.deleteAll('User');
        });
        afterEach( async () => {
            await utility.deleteDatabase();
        })
       
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


   
})}
  
    //Test gelAllTestDescriptors
    testgetAllTestDescriptors();

    async function testgetAllTestDescriptors() {
        describe('Test get all testDescriptors', () => { 

        beforeEach(async () => {
            //clear DB 
            await PersistentManager.deleteAll('InternalOrder');
    await PersistentManager.deleteAll('InternalOrderProduct');
    await PersistentManager.deleteAll('Item');
    await PersistentManager.deleteAll('Position');
    await PersistentManager.deleteAll('ProductOrder');
    await PersistentManager.deleteAll('RestockOrder');
    await PersistentManager.deleteAll('ReturnOrder');
    await PersistentManager.deleteAll('SKU');
    await PersistentManager.deleteAll('SKUItem');
    await PersistentManager.deleteAll('TestDescriptor');
    await PersistentManager.deleteAll('TestResult');
    await PersistentManager.deleteAll('TransportNote');
    await PersistentManager.deleteAll('User');
        });
    
        afterEach( async () => {
            await utility.deleteDatabase();
        })
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


    })
    
}

    //Test modifyTestDescriptor
        describe('Test modify testDescriptor', () => { 
            let newName = "new test name";
            let newDescription = "new description";
            let id_sku  = null;
            let test_id  = null;
            let newTestDescriptor = null;
        beforeEach(async () => {
            //clear DB 
            await PersistentManager.deleteAll('InternalOrder');
    await PersistentManager.deleteAll('InternalOrderProduct');
    await PersistentManager.deleteAll('Item');
    await PersistentManager.deleteAll('Position');
    await PersistentManager.deleteAll('ProductOrder');
    await PersistentManager.deleteAll('RestockOrder');
    await PersistentManager.deleteAll('ReturnOrder');
    await PersistentManager.deleteAll('SKU');
    await PersistentManager.deleteAll('SKUItem');
    await PersistentManager.deleteAll('TestDescriptor');
    await PersistentManager.deleteAll('TestResult');
    await PersistentManager.deleteAll('TransportNote');
    await PersistentManager.deleteAll('User');
        });
    
        afterEach( async () => {
            await utility.deleteDatabase();
        })
        test('modify testDescriptor', async () => {
            const sku = {description: "description",
                weight: 10,
                volume: 10,
                price: 10, 
                notes: "notes",
                availableQuantity: 10,
                position: null
            }
            id_sku = await PersistentManager.store("SKU",sku);
    
            const testDescriptor = {
                name: "test name",
                procedureDescription: "procedure description",
                idSKU: id_sku
            }
            test_id = await PersistentManager.store("testDescriptor",testDescriptor);
            await QualityTestManager.modifyTestDescriptor(test_id , newName, newDescription,id_sku);
            newTestDescriptor = await PersistentManager.loadOneByAttribute('id', "TestDescriptor", test_id);
            const expected = {
                id: test_id,
                name: "new test name",
                procedureDescription: "new description",
                idSKU: id_sku
            }
            expect(newTestDescriptor).toEqual(expected);
        })

        
        })
    

    //Test defineTestResult Valid
    testDefineTestResultValid("12341234123412341234123412341234","2022-01-01",1);

    async function testDefineTestResultValid(rfid,Date,Result) {
        describe('define testResult', () => {

            let testDescriptor_id = null;
            let lastTestResultId = null;
            let testResult = null;
        beforeEach(async () => {
            //clear DB 
            await PersistentManager.deleteAll('InternalOrder');
            await PersistentManager.deleteAll('InternalOrderProduct');
            await PersistentManager.deleteAll('Item');
            await PersistentManager.deleteAll('Position');
            await PersistentManager.deleteAll('ProductOrder');
            await PersistentManager.deleteAll('RestockOrder');
            await PersistentManager.deleteAll('ReturnOrder');
            await PersistentManager.deleteAll('SKU');
            await PersistentManager.deleteAll('SKUItem');
            await PersistentManager.deleteAll('TestDescriptor');
            await PersistentManager.deleteAll('TestResult');
            await PersistentManager.deleteAll('TransportNote');
            await PersistentManager.deleteAll('User');
           
        });
        afterEach( async () => {
            await utility.deleteDatabase();
        })
       
        test('define testResult valid', async () => {
            const sku = {description: "description",
                weight: 10,
                volume: 10,
                price: 10, 
                notes: "notes",
                availableQuantity: 10,
                position: null
            }
            let s = await PersistentManager.store("SKU", sku);
            const testDescriptor = {
                name: "test name",
                procedureDescription: "procedure description",
                idSKU: s
            }
            const skuItem = {
                RFID: '12341234123412341234123412341234',
                Available: 0,
                DateOfStock: '2022-01-01',
                SKUId: s,
                internalOrder_id: null,
                restockOrder_id: null,
                returnOrder_id: null
            }
            testDescriptor_id = await PersistentManager.store("testDescriptor",testDescriptor);
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

        test('define test result 404 rfid', async () => {
            const sku = {description: "description",
                weight: 10,
                volume: 10,
                price: 10, 
                notes: "notes",
                availableQuantity: 10,
                position: null
            }
            let s = await PersistentManager.store("SKU", sku);
            const testDescriptor = {
                name: "test name",
                procedureDescription: "procedure description",
                idSKU: s
            }
            const skuItem = {
                RFID: '12341234123412341234123412341234',
                Available: 0,
                DateOfStock: '2022-01-01',
                SKUId: s,
                internalOrder_id: null,
                restockOrder_id: null,
                returnOrder_id: null
            }
            testDescriptor_id = await PersistentManager.store("testDescriptor",testDescriptor);
            await PersistentManager.store("SKUItem",skuItem);
            return expect(QualityTestManager.defineTestResult("1",Date,Result,testDescriptor_id)).rejects.toEqual("404 rfid not found");
        }) 

        test('define test result 404 descriptor', async () => {
            const sku = {description: "description",
                weight: 10,
                volume: 10,
                price: 10, 
                notes: "notes",
                availableQuantity: 10,
                position: null
            }
            let s = await PersistentManager.store("SKU", sku);
            const testDescriptor = {
                name: "test name",
                procedureDescription: "procedure description",
                idSKU: s
            }
            const skuItem = {
                RFID: '12341234123412341234123412341234',
                Available: 0,
                DateOfStock: '2022-01-01',
                SKUId: s,
                internalOrder_id: null,
                restockOrder_id: null,
                returnOrder_id: null
            }
            testDescriptor_id = await PersistentManager.store("testDescriptor",testDescriptor);
            await PersistentManager.store("SKUItem",skuItem);
            return expect(QualityTestManager.defineTestResult(rfid,Date,Result,-1)).rejects.toEqual("404 TestDescriptor not found");
        }) 


    })
}

    //Test modifyTestResult
    testmodifyTestResult("12341234123412341234123412341234","2022-02-02",0);

    async function testmodifyTestResult(rfid, newDate, newResult) {
        describe('Test modify testResult', () => { 
            let s = null;
            let testDescriptor_id = null;
            let test_id = null;
        beforeEach(async () => {
            //clear DB 
            await PersistentManager.deleteAll('InternalOrder');
    await PersistentManager.deleteAll('InternalOrderProduct');
    await PersistentManager.deleteAll('Item');
    await PersistentManager.deleteAll('Position');
    await PersistentManager.deleteAll('ProductOrder');
    await PersistentManager.deleteAll('RestockOrder');
    await PersistentManager.deleteAll('ReturnOrder');
    await PersistentManager.deleteAll('SKU');
    await PersistentManager.deleteAll('SKUItem');
    await PersistentManager.deleteAll('TestDescriptor');
    await PersistentManager.deleteAll('TestResult');
    await PersistentManager.deleteAll('TransportNote');
    await PersistentManager.deleteAll('User');
        });
    
        afterEach( async () => {
            await utility.deleteDatabase();
        })
        test('modify testResult', async () => {
            const sku = {
                description: "des",
                weight: 10,
                volume: 10,
                price: 10,
                notes: "notes",
                availableQuantity: 1,
                position: null
            }
            
            s = await PersistentManager.store("SKU", sku);
            const testDescriptor = {
                name: "test name",
                procedureDescription: "procedure description",
                idSKU: s
            }
            const skuItem = {
                RFID: '12341234123412341234123412341234',
                Available: 0,
                DateOfStock: '2022-01-01',
                SKUId: s,
                internalOrder_id: null,
                restockOrder_id: null,
                returnOrder_id: null
            }
            testDescriptor_id = await PersistentManager.store("testDescriptor",testDescriptor);
            await PersistentManager.store("SKUItem",skuItem);
            const testResult = {
                rfid: '12341234123412341234123412341234',
                Date: '2022-02-02',
                Result: 1,
                idTestDescriptor: testDescriptor_id
            }
            test_id = await PersistentManager.store("testResult",testResult);
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


    })
    
}
