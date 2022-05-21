const RoManager = require("../bin/controller/RestockOrderManager");
const PersistentManager = require("../bin/DB/PersistentManager");
const RestockOrder = require('../bin/model/RestockOrder')


describe("test Delete", () => {
    let RO = new RestockOrder(null, "2021/11/29 09:33", "ISSUED", null, null);
    let RO2 = new RestockOrder(null, "2021/12/29 09:33", "TESTED", null, null);


    //Test Case 1
    let T1 = {
        attr: "State",
        val: "ISSUED",
        table: RestockOrder.tableName
    }

    //Test Case2
    let T2 = {
        attr: "State",
        val: "DELIVERED",
        table: RestockOrder.tableName
    }


    let ValidList=[];
    ValidList.push(T1,T2);
//testcase 3 invalid key
    let T3 = {
        WrongKey: "State",
        val: "ISSUED",
        table: RestockOrder.tableName
    }
//test case 4 invalid key with invalid row
    let T4 = {
        WrongKey: "State",
        val: "DELIVERED",
        table: RestockOrder.tableName
    }
    
//test case 5 Invalid table
let T5 = {
    WrongKey: "State",
    val: "ISSUED",
    table: "wrongTable"
}

//test case 6 Invalid table
let T6 = {
    attr: "State",
    val: "ISSUED",
    table: "wrongTable"
}

//test case 7 Invalid table with invalid key
let T7 = {
    WrongKey: "State",
    val: "ISSUED",
    table: "wrongTable"
}

//test case 8 Invalid table with invalid key with invalid row
let T8 = {
    WrongKey: "State",
    val: "DELIVERED",
    table: "wrongTable"
}

    let InvalidList=[];
    InvalidList.push(T3,T4,T5,T6,T7,T8)

    TestDelete(RestockOrder.tableName,
        RO,
        2,
        RO2,
        3,
        ValidList,
        InvalidList);

    function TestDelete(table, RO, NumInput1, RO2, NumInput2, ValidList, InvalidList) {


        //clear DB

        beforeEach(async () => {
            //initialize DB according to input
            await PersistentManager.deleteAll(table)

            for (let i = 0; i < NumInput1; i++) {
                await PersistentManager.store(table, RO);

            }
            for (let j = 0; j < NumInput2; j++) {
                await PersistentManager.store(table, RO2);

            }
        });

        describe("test Valid Delete", () => {
            test("ValidDelete", async () => {
                await PersistentManager.delete(ValidList[0].attr, ValidList[0].val, ValidList[0].table);
                var res = await PersistentManager.loadAllRows(table);
                expect(res.length).toStrictEqual(NumInput2);
            });

            test("ValidDeleteNull", async () => {
                await PersistentManager.delete(ValidList[1].attr, ValidList[1].val, ValidList[1].table);
                var res = await PersistentManager.loadAllRows(table);
                //return the same length as before
                expect(res.length).toStrictEqual(NumInput1 + NumInput2);
            });

        })

        describe("test Invalid Delete", () => {
            test("InValidDelete", async () => {
                for (let T in InvalidList){           
                    // expect(async () => {
                    //     await PersistentManager.delete(T.attr,T.val,T.table);
                    //   }).toThrow();    
                    return expect(PersistentManager.delete(T.attr, T.val, T.table)).rejects.toThrow();
                }

            });
        })
    }
   
})


describe("test Valid Update", () => {
    let RO = new RestockOrder(null, "2021/11/29 09:33", "ISSUED", null, null);
    let RO2 = new RestockOrder(null, "2021/12/29 09:33", "TESTED", null, null);
 


    //Test Case 1
    let T1 = {
        table: RestockOrder.tableName,
        object: { state: "DELIVERED" },
        attribute_name: "issue_date"
    }

    TestValidUpdate(RestockOrder.tableName, RO, 2, RO2, 3, T1);

    function TestValidUpdate(table, RO, NumInput1, RO2, NumInput2, T1) {
        //clear DB
        let RoId = [];
        beforeEach(async () => {
            //initialize DB according to input
            await PersistentManager.deleteAll(table)

            for (let i = 0; i < NumInput1; i++) {
                await PersistentManager.store(table, RO);

            }
            for (let j = 0; j < NumInput2; j++) {
                RoId = await PersistentManager.store(table, RO2);

            }
        });


        test("ValidUpdate", async () => {
            await PersistentManager.update(T1.table, T1.object, T1.attribute_name, "2021/11/29 09:33");
            var res = await PersistentManager.loadOneByAttribute("issue_date", T1.table, "2021/11/29 09:33");
            expect(res.state).toStrictEqual("DELIVERED");
        });
    };


});


describe("test Invalid Update", () => {
    let RO = new RestockOrder(null, "2021/11/29 09:33", "ISSUED", null, null);
    let RO2 = new RestockOrder(null, "2021/12/29 09:33", "TESTED", null, null);
    //   async update(tableName, object, attribute_name, id) 
    

    //Test Case 2 incorrect type of value 
    let T2 = {
        table: RestockOrder.tableName,
        object: { state: "DELIVERED" },
        attribute_name: "wrong111"
    }

    //Test Case3 Incorrect value part of object
    let T3 = {
        table: RestockOrder.tableName,
        object: { issue_date: "wrongDate" },
        attribute_name: "issue_date"
    }

    //Test Case4 Incorrect value part of object with incorrect attributeid  
    let T4 = {
        table: RestockOrder.tableName,
        object: { state: "wrong" },
        attribute_name: "issue_date1"
    }

    //Test Case5 Incorrect key part of object 
    let T5 = {
        table: RestockOrder.tableName,
        object: { wrongKey: "DELIVERED" },
        attribute_name: "issue_date"
    }

    //Test Case6 Incorrect key part of object with incorrect id
    let T6 = {
        wrongKey: RestockOrder.tableName,
        object: { wrongKey: "DELIVERED" },
        attribute_name: "wrong"
    }

    //Test Case7 Incorrect value part of object 
    let T7 = {
        table: RestockOrder.tableName,
        object: { state: "wrong" },
        attribute_name: "issue_date"
    }

    //Test Case8 Incorrect value part of object with incorrect id
    let T8 = {
        table: RestockOrder.tableName,
        object: { state: "DELIVERED" },
        attribute_name: "wrong"
    }

    //Test Case9 No row found
    let T9 = {
        table: RestockOrder.tableName,
        object: { state: "DELIVERED" },
        attribute_name: "id"
    }

    //Test Case10 Invalid key
    let T10 = {
        wrong: RestockOrder.tableName,
        object: { state: "DELIVERED" },
        attribute_name: "issue_date"
    }

    //Test Case11 invalid Key and wrong attribute
    let T11 = {
        wrong: RestockOrder.tableName,
        object: { state: "DELIVERED" },
        attribute_name: "wrong"
    }

    //Test Case12 invalid Key and wrong value part of object
    let T12 = {
        wrong: RestockOrder.tableName,
        object: { state: "wrong" },
        attribute_name: "issue_date"
    }

    //Test Case13 invalid Key and wrong key part of object
    let T13 = {
        wrong: RestockOrder.tableName,
        object: { wrong: "DELIVERED" },
        attribute_name: "issue_date"
    }

    //Test Case14 invalid Key and invalid attribute
    let T14 = {
        wrong: RestockOrder.tableName,
        object: { wrong: "DELIVERED" },
        attribute_name: "wronge_date"
    }

    //Test Case15 invalid Key and incorrect value part object
    let T15 = {
        wrong: RestockOrder.tableName,
        object: { wrong: "wrong" },
        attribute_name: "issue_date"
    }
    //Test Case16 invalid Key and incorrect value part object and incorrect type of value
    let T16 = {
        wrong: RestockOrder.tableName,
        object: { wrong: "wrong" },
        attribute_name: "wrong"
    }

    //Test Case17 wrong table name
    let T17 = {
        table: "wrongTable",
        object: { state: "wrong" },
        attribute_name: "id"
    }




    let InvalidUpdateList = [];
    InvalidUpdateList.push( T2)

    TestInvalidUpdate(RestockOrder.tableName, RO, 2, RO2, 3, T2);

    function TestInvalidUpdate(table, RO, NumInput1, RO2, NumInput2,T2) {
        //clear DB
        let RoId = [];
        beforeEach(async () => {
            //initialize DB according to input
            await PersistentManager.deleteAll(table)
            for (let i = 0; i < NumInput1; i++) {
                await PersistentManager.store(table, RO);
            }
            for (let j = 0; j < NumInput2; j++) {
                RoId = await PersistentManager.store(table, RO2);
            }
        });



        test("InValidUpdate", async () => {
            //for (let T of InvalidUpdateList) {
                return expect(PersistentManager.update(T2.table, T2.object, T2.attribute_name, "2021/11/29 09:33").rejects.toThrow());
            // }
        });

        // test("InValid Update When Row not availale", async () => {
        //     return expect(PersistentManager.update(T9.table, T9.object, T9.attribute_name, 0)).rejects.toThrow();

        // });
    };
});















