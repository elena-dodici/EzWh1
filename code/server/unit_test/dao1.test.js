
const RoManager = require("../bin/controller/RestockOrderManager");
const PersistentManager = require("../bin/DB/PersistentManager");
const RestockOrder = require('../bin/model/RestockOrder')



describe("testDao",()=>{
    //clear DB
    let TestIds=[];
    beforeAll(async ()=>{
        //clear table and create one row

        await deleteAll(RestockOrder.tableName)
        let newReO = new RestockOrder(null, "2021/11/29 09:33", "ISSUED", null, null);
        let newReO2 = new RestockOrder(null, "2021/12/29 09:33", "TESTED", null, null);
        
        let testId1 = await PersistentManager.store(RestockOrder.tableName, newReO);   
        let testId2 = await PersistentManager.store(RestockOrder.tableName, newReO2); 
        TestIds.push(testId1)
        TestIds.push(testId2)
        return TestIds;
        

    });
    
   
    test("delete db",async()=>{
       
        var res = await PersistentManager.loadAllRows(RestockOrder.tableName);
        expect(res.length).toStrictEqual(2);
    });
    


    testStore(RestockOrder.tableName,TestIds)
    testUpdate(RestockOrder.tableName,TestIds,"DELIVERED")
    testExists(RestockOrder.tableName,TestIds)
    testFilterByAttribute(RestockOrder.tableName,TestIds,"TESTED")
    testByMoreAttributes(RestockOrder.tableName,TestIds,"2021/12/29 09:33","TESTED")
    
    
})

function testFilterByAttribute(tableName,TestIds,attr) {
    test('test filterByOneAttr', async () => {         
        let res =  await PersistentManager.loadFilterByAttribute(tableName,"state","TESTED")     
        expect(res[0].id).toStrictEqual(TestIds[1]);
        
    });
}
    

function testByMoreAttributes(tableName,TestIds,attr1,attr2) {
    test('test filterByMoreAttrs', async () => {        
        let res = await PersistentManager.loadByMoreAttributes(tableName, ['issue_date','state'],[attr1,attr2])    
        expect(res[0].id).toStrictEqual(TestIds[1]);
    });
}


function testExists(tableName,TestIds) {
    test('test exist', async () => {     
          
        let exist = await PersistentManager.exists(tableName, 'id',TestIds[0])
        expect(exist).toBeTruthy();
    });
}
    

function testUpdate(tableName,TestIds,newData) {
    
    test('test update', async () => {    
        jest.setTimeout(100000 * 1000) 
    
        await PersistentManager.update(tableName,{state:newData},"id",TestIds[0]);      
        res = await PersistentManager. loadOneByAttribute("id", tableName, TestIds[0] );
       
        expect(res.state).toStrictEqual("DELIVERED");

    });
}
    


function testStore(tableName,TestIds) {
    test('create new row', async () => {     
     
        var res = await PersistentManager.loadAllRows(tableName);
        expect(res.length).toStrictEqual(2);        
        res = await PersistentManager. loadOneByAttribute("id", tableName, TestIds[0] );
        expect(res.id).toStrictEqual(TestIds[0]);
        expect(res.issue_date).toStrictEqual("2021/11/29 09:33");
        expect(res.state).toStrictEqual("ISSUED");
        
    });
}
    

