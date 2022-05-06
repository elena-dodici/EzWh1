const SKU = require('../model/SKU');
const PersistentManager = require('../DB/PersistentManager');
const TestDescriptor = require('../model/TestDescriptor');

class SKUManager{
    constructor() {}

    defineSKU(description, weight, volume, price, notes, availableQuantity) {
        //Converting it to be saved in the db
        //Delete sku.id because it is autoincremented
        const sku = new SKU(null, description, weight, volume, price, notes, availableQuantity, null);
        delete sku.id;
        delete sku.position;
        delete sku.testDescriptors;
        sku.position_id = null;
        return PersistentManager.store(SKU.tableName, sku);
    }

    async listAllSKUs() {
        let result = await PersistentManager.loadAllRows(SKU.tableName);
        
        
    }

}

module.exports = new SKUManager();