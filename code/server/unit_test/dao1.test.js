
const RoManager = require("../bin/controller/RestockOrderManager");
const PersistentManager = require("../bin/DB/PersistentManager");
const RestockOrder = require('../bin/model/RestockOrder')



describe("testDao",()=>{
    //clear DB
    let TestIds=[];
    beforeAll(async ()=>{
        //clear table and create one row
        await PersistentManager.delete("issue_date","2021/11/29 09:33",RestockOrder.tableName);
        await PersistentManager.delete("issue_date","2021/12/29 09:33",RestockOrder.tableName);
        
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
    
    // let newReO = new RestockOrder(null, "2021/11/29 09:33", "ISSUED", null, null);
    // let newReO2 = new RestockOrder(null, "2021/12/29 09:33", "TESTED", null, null);
    // let data = [newReO,newReO2]

    testStore(RestockOrder.tableName,TestIds)
    testUpdate(RestockOrder.tableName,TestIds,"DELIVERED")
    testExists(RestockOrder.tableName,TestIds)
    testFilterByAttribute(RestockOrder.tableName,TestIds,"TESTED")
    testByMoreAttributes(RestockOrder.tableName,TestIds,"2021/12/29 09:33","TESTED")
    
    
})

function testFilterByAttribute(tableName,TestIds,attr) {
    test('test filterByOneAttr', async () => {     
      
        // let testId1= await PersistentManager.store(tableName, data[0]);  
        // let testId2= await PersistentManager.store(tableName, data[1]);
        let res =  await PersistentManager.loadFilterByAttribute(tableName,"state","TESTED")     
        expect(res[0].id).toStrictEqual(TestIds[1]);
        
    });
}
    

function testByMoreAttributes(tableName,TestIds,attr1,attr2) {
    test('test filterByMoreAttrs', async () => {     
        // let testId1= await PersistentManager.store(tableName, data[0]);  
        // let testId2= await PersistentManager.store(tableName, data[1]);      
        let res = await PersistentManager.loadByMoreAttributes(tableName, ['issue_date','state'],[attr1,attr2])    
        expect(res[0].id).toStrictEqual(TestIds[1]);
    });
}


function testExists(tableName,TestIds) {
    test('test exist', async () => {     
        //let testId= await PersistentManager.store(tableName, data[0]);       
        let exist = await PersistentManager.exists(tableName, 'id',TestIds[0])
        expect(exist).toBeTruthy();
    });
}
    

function testUpdate(tableName,TestIds,newData) {
    
    test('test update', async () => {    
        jest.setTimeout(100000 * 1000) 
       // let testId1= await PersistentManager.store(tableName, data[0]);
        await PersistentManager.update(tableName,{state:newData},"id",TestIds[0]);      
        res = await PersistentManager. loadOneByAttribute("id", tableName, TestIds[0] );
       
        expect(res.state).toStrictEqual("DELIVERED");

    });
}
    


function testStore(tableName,TestIds) {
    test('create new row', async () => {     
        // let testId1= await PersistentManager.store(tableName, data[0]);   
        // let testId2= await PersistentManager.store(tableName, data[1]);        
        var res = await PersistentManager.loadAllRows(tableName);
        expect(res.length).toStrictEqual(2);        
        res = await PersistentManager. loadOneByAttribute("id", tableName, TestIds[0] );
        expect(res.id).toStrictEqual(TestIds[0]);
        expect(res.issue_date).toStrictEqual("2021/11/29 09:33");
        expect(res.state).toStrictEqual("ISSUED");
        
    });
}
    



// testloadOneByAttribute( ["id", RestockOrder.tableName, "1"],{
//     "returnDate":"2021/11/29 09:33",
//     "products": [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
//                 {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
//     "restockOrderId" : 1
// })



// function testloadOneByAttribute(input,expectedOutput){
//     test("test loadOne", ()=>{
//         pM = new PersistentManager ();
//         expect(pM.loadOneByAttribute(input)).toStrictEqual((expectedOutput));
//     });
// }


// describe('get one',()=>{
//     //reset mock db
//     beforeEach(async ()=>{
//         await dao.loadOneByAttribute.mockReset();
//         //need return special val 1st.2nd..
//         dao.loadOneByAttribute.mockReturnValueOnce({
//             //should write what return from db
//         }).mockReturnValue({
//             "id":"1",
//             "returnDate":"2022/12/23",
//             "restockOrder_id":"28",
//             "products": [{"SKUId":1,"description":"1st in 2nd returnO","price":15.99, "RFID":"12345678901234567890123456789016"},
//                         {"SKUId":2,"description":"2nd in 2nd returnO","price":18.99,"RFID":"12345678901234567890123456789038"}],

//         });
//     });


//     test('getOne', async() => {
//         const id = '1';
//         let res = await RoManager.getRestockOrderByID(id);
//         expect(res).toEqual({
//             "returnDate":"2021/11/30 09:56",
//             "products": [{"SKUId":1,"description":"1st in 2nd returnO","price":15.99,               "RFID":"12345678901234567890123456789016"},
//                         {"SKUId":2,"description":"2nd in 2nd returnO","price":18.99,"RFID":"12345678901234567890123456789038"}],
//             "restockOrderId" : 1
//         })
//     })
// })
