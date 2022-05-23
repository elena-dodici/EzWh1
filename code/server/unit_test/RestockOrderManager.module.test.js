const PersistentManager = require('../bin/DB/PersistentManager');
const RestockOrderManager = require('../bin/controller/RestockOrderManager');
const TransportNote = require('../bin/model/TransportNote');
const Item = require("../bin/model/Item");
const SKU = require("../bin/model/SKU")
const User = require("../bin/model/User")

describe('RestockOrder tests', () => {



       
        describe('restock order tests', () => {
        let input={};
        beforeEach(async () => {
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
            //supply must  exist  
            const user = new User("user1@ezwh.com", "testpassword", "John", "Snow", "supplier");          
            supplier_id = await PersistentManager.store("User",user);
            
            //sku must exist
            let Sku  = new SKU(null, "product", "2", "3", 10.99, "notes", 5, null);
            delete Sku.testDescriptors;
            let SkuId = await PersistentManager.store("SKU",Sku);
            //itemid must be exist
            let item = new Item(null,"a new item",10.99,SkuId,supplier_id);
            let itemId = await PersistentManager.store("Item",item);
        
            input ={
                issue_date : "2021/11/29 09:33",
                products : [{"SKUId":SkuId,"description":"a new item","price":10.99,"qty":30},
                           ],
            
                supplier_id : supplier_id
            }

        })

        test('define restockOrder', async () => {
            let roId =  await RestockOrderManager.defineRestockOrder(input.issue_date, input.products, input.supplier_id);          
            const ro = await PersistentManager.loadOneByAttribute("id","RestockOrder",roId);
            const expected = {
                id: roId,
                issue_date: input.issue_date,
                state:"ISSUED",
                supplier_id:input.supplier_id,
                transport_note_id: null,
                
            };
            expect(ro).toEqual(expected);
        })

        test('load All restockOrder', async()=> {
            let roId =  await RestockOrderManager.defineRestockOrder(input.issue_date, input.products, input.supplier_id);                     
            const res = await RestockOrderManager.getAllRestockOrder();
            
            const expected = {
                id: roId,
                issueDate: input.issue_date,
                state:"ISSUED",
                products: input.products,
                supplierId:input.supplier_id,
                transportNote:[],
                skuItems:[]
            }
            expect(res[0]).toEqual(expected);
            expect(res[1]).toEqual(undefined);
        })


        test('modify state ', async() => {
            const newState = "DELIVERED";
            // return type change if state change into delivered
            let roId =  await RestockOrderManager.defineRestockOrder(input.issue_date, input.products, input.supplier_id);                     
            await RestockOrderManager.modifyState(roId,newState);
            const res = await RestockOrderManager.getAllRestockOrder();
            const expected = {
                id: roId,
                issueDate: input.issue_date,
                state:newState,
                products: input.products,
                supplierId:input.supplier_id,
                skuItems:[]
            }
            expect(res[0]).toEqual(expected);

            


        })
    })
})
