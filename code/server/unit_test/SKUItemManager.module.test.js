const PersistentManager = require('../bin/DB/PersistentManager');
const SKUItemManager = require('../bin/controller/SKUItemManager');

describe('sku items tests', () => {


    const rfid = "12341234123412341234123412341234";
    const date = "2022-01-01";

    let expected = null;
    

    skuItemsTests(rfid, date);

    function skuItemsTests (rfid, dateofstock) {
        let s1 = null;
        beforeEach(async () => {
            await PersistentManager.deleteAll("SKU");
            await PersistentManager.deleteAll("SKUItem");
            s1 = {
                description: "description",
                weight: 10,
                volume: 10,
                price: 10, 
                notes: "notes",
                availableQuantity: 10,
                position: null
            }
            
            
            
            
        })

        test('test define sku item', async () => {
            id1 = await PersistentManager.store("SKU", s1);
            expected = {
                RFID: '12341234123412341234123412341234',
                Available: 0,
                DateOfStock: '2022-01-01',
                SKUId: id1,
                internalOrder_id: null,
                restockOrder_id: null,
                returnOrder_id: null
            }
            await SKUItemManager.defineSKUItem(rfid, id1, dateofstock);
            const skuitem = await PersistentManager.loadOneByAttribute('rfid', "SKUItem", rfid);
            expect(skuitem).toEqual(expected);
        })

        //SEARCH BY RFID
        test('get item by rfid', async() => {
            id1 = await PersistentManager.store("SKU", s1);
            expected = {
                RFID: '12341234123412341234123412341234',
                Available: 0,
                DateOfStock: '2022-01-01',
                SKUId: id1,
                internalOrder_id: null,
                restockOrder_id: null,
                returnOrder_id: null
            }
            expectedForAPI = {
                RFID: '12341234123412341234123412341234',
                Available: 0,
                DateOfStock: '2022-01-01',
                SKUId: id1
            }
            await SKUItemManager.defineSKUItem(rfid, id1, dateofstock);
            const item = await SKUItemManager.searchByRFID(rfid);
            expectedFromApi = {...expected};
            
            expect(item).toEqual(expectedForAPI);
        })

        test('delete sku item', async() => {
            id1 = await PersistentManager.store("SKU", s1);
            await SKUItemManager.defineSKUItem(rfid, id1, dateofstock);
            await SKUItemManager.deleteSKUItem(rfid);
            const items = await PersistentManager.loadAllRows("SKUItem");
            expect(items).toEqual([]);
        })

        afterEach(async () => {
            await PersistentManager.deleteAll("SKUItem");
            await PersistentManager.deleteAll("SKU");
        })
    }
});

