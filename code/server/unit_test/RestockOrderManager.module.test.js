const PersistentManager = require('../bin/DB/PersistentManager');
const RestockOrderManager = require('../bin/controller/RestockOrderManager');
const TransportNote = require('../bin/model/TransportNote');

describe('RestockOrder tests', () => {


    let input ={
        issue_date : "2021/11/29 09:33",
        products : [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
                   {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
    
        supplierId : 1
    }

    let newSkuitemsinfo =  {
        "skuItems" : [{"SKUId":12,"rfid":"12345678901234567890123456789016"},
                      {"SKUId":12,"rfid":"12345678901234567890123456789017"}]
    }


    RestockOrderTest(input,newSkuitemsinfo)

    function RestockOrderTest(input,Updateinfo) {
        let testId=[];
        beforeAll(async () => {
            await PersistentManager.deleteAll("RestockOrder");
        

        })

        test('define restockOrder', async () => {
            let roId =  await RestockOrderManager.defineRestockOrder(input.issue_date, input.productsList, input.supplierId);
            
            const ro = await PersistentManager.loadOneByAttribute("id","RestockOrder",roId);
            const expected = {
                id: roId,
                issueDate: input.issue_date,
                state:"ISSUED",
                produts: input.products,
                supplierId:input.supplierId,
                TransportNote:null,
                skuItems:null
            };
            expect(ro).toEqual(expected);
        })

        test('load All restockOrder', async()=> {
            const res = await RestockOrderManager.getAllRestockOrder();
            
            const expected = {
                id: roId,
                issueDate: input.issue_date,
                state:"ISSUED",
                produts: input.products,
                supplierId:input.supplierId,
                TransportNote:null,
                skuItems:null
            }
            expect(res[0]).toEqual(expected);
            expect(res[1]).toEqual(undefined);
        })

        // test('modify ', async() => {
        //     //const newID = "000100010001"
        //     await RestockOrderManager.putSKUItems(Updateinfo);
        //     const pos = await PositionManager.listAllPositions();
        //     const p = pos[0]
        //     const expected = {
        //         positionID: "000100010001",
        //         aisleID : "0001",
        //         row : "0001",
        //         col : "0001",
        //         maxWeight : 1000,
        //         maxVolume : 1000,
        //         occupiedWeight: 0,
        //         occupiedVolume: 0
        //     }
        //     expect(p).toEqual(expected);

        // })

        // test('modify ', async() => {
        //     const newID = "000100010001"
        //     await PositionManager.changePositionID(Updateinfo);
        //     const pos = await PositionManager.listAllPositions();
        //     const p = pos[0]
        //     const expected = {
        //         positionID: "000100010001",
        //         aisleID : "0001",
        //         row : "0001",
        //         col : "0001",
        //         maxWeight : 1000,
        //         maxVolume : 1000,
        //         occupiedWeight: 0,
        //         occupiedVolume: 0
        //     }
        //     expect(p).toEqual(expected);

        // })
    }
})
