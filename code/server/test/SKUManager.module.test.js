
const SKUManager = require('../bin/controller/SKUManager');
const PersistentManager = require('../bin/DB/PersistentManager');

//Assuming data validation done at a higher level
async function testDefineSKU() {
describe('define sku', () => {
    test('define sku', async () => {
        const lastSKUId = await SKUManager.defineSKU("description", 10, 10, 10, "notes", 10);
        const sku = await PersistentManager.loadOneByAttribute('id', "SKU", lastSKUId);
        const expected = {
            id: lastSKUId,
            description: "description",
            weight: 10,
            volume: 10,
            price: 10, 
            notes: "notes",
            availableQuantity: 10,
            position: null
        }
        expect(sku).toEqual(expected);
    })

    test('define sku invalid', async () => {
        const lastSKUId = await SKUManager.defineSKU("description", 10, 10, 10, "notes", 10);
        const sku = await PersistentManager.loadOneByAttribute('id', "SKU", lastSKUId);
        const expected = {
            id: lastSKUId,
            description: "description different",
            weight: 10,
            volume: 10,
            price: 10, 
            notes: "notes",
            availableQuantity: 10,
            position: null
        }
        expect(sku).not.toEqual(expected);
    })

    afterEach(() => {
        PersistentManager.deleteAll("SKU");
    })
})
}

//Define sku valid
testDefineSKU()
