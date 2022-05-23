const PersistentManager = require('../bin/DB/PersistentManager');
const RestockOrderManager = require('../bin/controller/RestockOrderManager');
const TransportNote = require('../bin/model/TransportNote');
const RestockOrder = require('../bin/model/RestockOrder');
const ReturnOrderManager = require('../bin/controller/ReturnOrderManager');
const SKU = require('../bin/model/SKU');
const SKUItem = require('../bin/model/SKUItem');
const utility = require("../bin/utility/utility");

describe('RestockOrder tests', () => {



    RestockOrderTest()

    function RestockOrderTest() {
        let restockOrderId=[];
        let input={};
        let SkuId=null;
        let rfid = null;
        beforeEach(async () => {
            await PersistentManager.deleteAll("ReturnOrder");
            //restockOrder 
            //sku must exist
            let Sku  = new SKU(null, "product", "2", "3", 10.99, "notes", 5, null);
            delete Sku.testDescriptors;
            let SkuId = await PersistentManager.store("SKU",Sku);
            
            let ro = new RestockOrder(null, "2021/10/29 09:33", "ISSUED", null, null);
            restockOrderId = await PersistentManager.store("RestockOrder",ro )
            input ={
                date : "2021/11/29 09:33",
                productsList : [{"SKUId":SkuId,"description":"a new item","price":10.99,"RFID":"12345678901234567890123456789019"} ],       
            }
            //skuitem must exist
            let s = new SKUItem( input.productsList[0].RFID, SkuId,"2021/10/29 09:33",null,null,null);
            utility.renameKey(s, "relativeSKU", "SKUId");
            utility.renameKey(s, "internalOrder", "internalOrder_id");
            utility.renameKey(s, "restockOrder", "restockOrder_id");
            utility.renameKey(s, "returnOrder", "returnOrder_id");
    
            await PersistentManager.store("SKUItem",s);
        })

        

        test('define returnOrder', async () => {
            let roId =  await ReturnOrderManager.defineReturnOrder(input.date,input.productsList,restockOrderId);          
            const ro = await PersistentManager.loadOneByAttribute("id","ReturnOrder",roId);
            const expected = {
                id: roId,
                returnDate: input.date,
                restockOrder_id:restockOrderId
                
            };
            expect(ro).toEqual(expected);
        })

        test('load All returnOrder', async()=> {
            let roId =  await ReturnOrderManager.defineReturnOrder(input.date,input.productsList,restockOrderId);          
            const res = await ReturnOrderManager.listAllReturnOrders();
            
            const expected = {         
                    id:roId,
                    returnDate:input.date,
                    products: [{"SKUId":SkuId,"description":input.productsList[0].description,"price":input.productsList[0].price,"RFID":"12345678901234567890123456789019"}],
                    restockOrderId : restockOrderId
                
        
            }
            expect(res[0]).toEqual(expected);
            expect(res[1]).toEqual(undefined);
        })



    }
})
