
const ItemManager = require('../bin/controller/ItemManager');
const PersistentManager = require('../bin/DB/PersistentManager');

describe('define item', () => {

    //Test defineItem Valid
    testDefineItemValid("description", 10.10, 1, 1);

    let sku_id = null;
    let supplier_id = null;

    async function testDefineItemValid(description, price, SKUId,supplierId) {
        beforeEach(async () => {
            //clear DB 
            await PersistentManager.deleteAll("Item");
            await PersistentManager.deleteAll("SKU");
            await PersistentManager.deleteAll("User");
           
            const sku = {description: "description",
                weight: 10,
                volume: 10,
                price: 10, 
                notes: "notes",
                availableQuantity: 10,
                position: null
            }
            const user = {
                username: "test@test.com",
                password: "testPassword",
                name: "name",
                surname: "surname",
                type: "SUPPLIER"
            }
            sku_id = await PersistentManager.store("SKU",sku);
            supplier_id = await PersistentManager.store("User",user);
        });
       
        test('define item valid', async () => {
            const lastItemId = await ItemManager.defineItem(description, price, SKUId,supplierId);
            const Item = await PersistentManager.loadOneByAttribute('id', "Item", lastItemId);
            const expected = {
                description: description,
                price: price,
                SKUId: sku_id,
                supplierId: supplier_id
            }
            expect(Item).toEqual(expected);
        });

        afterEach(() => {
            PersistentManager.deleteAll("Item");
            PersistentManager.deleteAll("SKU");
            PersistentManager.deleteAll("User");
        });
   
    }

    //Test defineItem Invalid
    testDefineItemInvalid("description", 10.10, 1, 1);

    async function testDefineItemInvalid(description, price, SKUId,supplierId) {
   
        beforeEach(async () => {
            //clear DB 
            await PersistentManager.deleteAll("Item");
            await PersistentManager.deleteAll("SKU");
            await PersistentManager.deleteAll("User");
        });

        test('define testItem invalid', async () => {
            return expect(ItemManager.defineItem(description, price, SKUId,supplierId)).rejects.toThrow();
        });
    }
});

describe('Test modify Itemt', () => { 

    //Test modifyItem
    testmodifyItem(1,"12341234123412341234123412341234",1,"2022-02-02",false);

    async function testmodifyItem(ItemId, newDescription, newPrice) {

        beforeEach(async () => {
            //clear DB 
            await PersistentManager.deleteAll("Item");
            await PersistentManager.deleteAll("SKU");
            await PersistentManager.deleteAll("User");
            const sku = {description: "description",
                weight: 10,
                volume: 10,
                price: 10, 
                notes: "notes",
                availableQuantity: 10,
                position: null
            }
            const user = {
                username: "test@test.com",
                password: "testPassword",
                name: "name",
                surname: "surname",
                type: "SUPPLIER"
            }
            sku_id = await PersistentManager.store("SKU",sku);
            supplier_id = await PersistentManager.store("User",user);
        });
    
        test('modify Item', async () => {
            const lastItemId = await ItemManager.modifyItem(ItemId, newDescription, newPrice);
            const Item = await PersistentManager.loadOneByAttribute('id', "Item", lastItemId);
            const expected = {
                description: newDescription,
                price: newPrice,
                SKUId: sku_id,
                supplierId: supplier_id
            }
            expect(Item).toEqual(expected);
        })

        afterEach(() => {
            PersistentManager.deleteAll("Item");
            PersistentManager.deleteAll("SKU");
            PersistentManager.deleteAll("User");
        })
    }
    
});
