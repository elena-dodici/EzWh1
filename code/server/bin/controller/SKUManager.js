const SKU = require('../model/SKU');
const PersistentManager = require('../DB/PersistentManager');
const TestDescriptor = require('../model/TestDescriptor');
const PositionManager = require('../controller/PositionManager');
const utility = require('../utility/utility');
const Position = require('../model/Position');

class SKUManager{
    constructor() {}

    defineSKU(description, weight, volume, price, notes, availableQuantity) {
        //Converting it to be saved in the db
        //Delete sku.id because it is autoincremented
        const sku = new SKU(null, description, weight, volume, price, notes, availableQuantity, null);
        delete sku.id;
        delete sku.testDescriptors;
        return PersistentManager.store(SKU.tableName, sku);
    }

    async listAllSKUs() {
        let result = await PersistentManager.loadAllRows(SKU.tableName);
        let s = [];
        for (let i = 0; i < result.length; i++) {
            let currentSKU = result[i];
            currentSKU.testDescriptors = [];
            let res = await this._loadTests(currentSKU.id);
            for (const test of res) {
               currentSKU.testDescriptors.push(test.id);
            }  
            s.push(currentSKU);   
        }
        
        return s;
        
        
    }

    async getSKUByID(id) {
        return PersistentManager.loadOneByAttribute('id', SKU.tableName, id);
    }

    async modifySKU(id, newDescription, newWeight, newVolume, newPrice, newNotes, newQuantity) {
        let loadedSKU = await this.getSKUByID(id);
        if (loadedSKU) {
            //There is a position to handle
            if (loadedSKU.position != null) {
                let loadedPosition = await PositionManager.loadPositionById(loadedSKU.position);
                let p = new Position(loadedPosition.id, loadedPosition.aisle, loadedPosition.row, loadedPosition.col,
                    loadedPosition.max_weight, loadedPosition.max_volume, loadedPosition.occupied_weight, loadedPosition.occupied_volume,
                    loadedPosition.sku_id);
                const canItStore = p.canItStore(newQuantity * newWeight, newQuantity * newVolume);
                if (!canItStore) {
                    return Promise.reject("422 position not capable");
                }
                //Update the position with the new occupied volume and weight
                PositionManager.modifyPosition(loadedPosition.id, loadedPosition.aisle, loadedPosition.row, loadedPosition.col,
                    loadedPosition.max_weight, loadedPosition.max_volume, newQuantity * newWeight, newQuantity * newVolume);
            }
            let skuToUpdate = {
                description: newDescription,
                weight: newWeight,
                volume: newVolume,
                price: newPrice,
                notes: newNotes,
                availableQuantity: newQuantity
            }
            return PersistentManager.update(SKU.tableName, skuToUpdate, 'id', id);
        }
        else {
            return Promise.reject("404")
        }
    }

    async setPosition(SKUId, positionID) {
       
        let loadedPosition = await PersistentManager.loadOneByAttribute('id',Position.tableName, positionID);
        if (!loadedPosition) {
            return Promise.reject("404 position");
        }
        let loadedSKU = await this.getSKUByID(SKUId);
        if (!loadedSKU) {
            return Promise.reject("404 SKU");
        }
        const sku_weight = loadedSKU.weight;
        const sku_volume = loadedSKU.volume;
        const sku_quantity = loadedSKU.availableQuantity;
        const p = new Position(loadedPosition.id, loadedPosition.aisle, loadedPosition.row, loadedPosition.col,
                    loadedPosition.max_weight, loadedPosition.max_volume, loadedPosition.occupied_volume,
                    loadedPosition.max_volume, loadedPosition.sku_id)
        const canItStore = p.canItStore(sku_quantity * sku_volume, sku_quantity * sku_weight);
        if (!canItStore) {
            
            return Promise.reject("422 position not capable");
        }
        loadedSKU.position = loadedPosition.id;
        loadedPosition.occupied_volume = sku_quantity * sku_volume;
        loadedPosition.occupied_weight = sku_quantity * sku_weight;

        delete loadedPosition.id;
        try {
            await PersistentManager.update(SKU.tableName, {position: positionID}, 'id', SKUId);
            await PersistentManager.update(Position.tableName, loadedPosition, 'id', positionID);
        }
        catch {
            return Promise.reject("generic error");
        }
        return Promise.resolve();


    }

    async deleteSKU(SKUId) {
        let loadedSKU = await this.getSKUByID(SKUId);
        
        if (loadedSKU.availableQuantity) {
            return Promise.reject("422 availabiliy not 0");
        }

        return PersistentManager.delete('id', SKUId, SKU.tableName);

    }

    async _loadTests(id) {
        let tests;
        await PersistentManager.loadFilterByAttribute(TestDescriptor.tableName, 'sku_id', id).then(
            result => {
                tests = result;
            },
            error => {
                console.log(error);
            }  
        );
        return tests;

    }





}

module.exports = new SKUManager();