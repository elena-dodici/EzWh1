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


describe('list all skus', () => {
    const s1 = {
        description: "description",
        weight: 10,
        volume: 10,
        price: 10, 
        notes: "notes",
        availableQuantity: 10,
        position: null
    }

    let id1 = null;
    
    listSKUS("SKU");

    function listSKUS (tableName) {
        beforeEach(async () => {
            await PersistentManager.deleteAll(tableName);
            //id1 = await PersistentManager.store(tableName, s1);
        })

        test('test list all skus valid', async () => {
            id1 = await SKUManager.defineSKU(s1.description, s1.weight, s1.volume, s1.price, s1.notes, s1.availableQuantity);
            const list = await SKUManager.listAllSKUs();
            let exp1 = s1;
            exp1.id = id1;
            exp1.testDescriptors = [];
            const sku = list[0];
            expect(sku).toEqual(exp1);
        })
    }
});

describe('set sku position', () => {
    
    let p1= {
        id: "123412341234",
        aisle: "1234",
        row: "1234",
        col: "1234",
        max_weight: 100,
        max_volume: 100,
        occupied_weight: 0,
        occupied_volume: 0
    }
    const s = {
        description: "description",
        weight: 10,
        volume: 10,
        price: 10, 
        notes: "notes",
        availableQuantity: 10,
        position: null
    }
    
    let idSKU = null;
    let positionID = p1.id;
    
    setPosition(idSKU, positionID);

    function setPosition (kuid, positionid) {
        beforeEach(async () => {
            await PersistentManager.deleteAll("SKU");
            await PersistentManager.deleteAll("Position");
            idSKU = await PersistentManager.store("SKU", s);
            await PersistentManager.store("Position", p1);
            
        })

        test('change sku position valid', async () => {
            await SKUManager.setPosition(idSKU, positionID);
            const s = await PersistentManager.loadOneByAttribute('id', "SKU", idSKU);
            const p = await PersistentManager.loadOneByAttribute('id', "Position", positionID);
            
            expect(s.position + "").toEqual(positionID);
            expect(p.occupied_volume).toEqual(s.volume*s.availableQuantity);
            expect(p.occupied_weight).toEqual(s.weight*s.availableQuantity);
        })
    }
});


