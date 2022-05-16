const Position = require('../model/Position');
const PersistentManager = require('../DB/PersistentManager');
const SKU = require('../model/SKU');
const SKUManager = require('../controller/SKUManager');


class PositionManager {

    

    constructor() {}

    definePosition(positionID, aisleID, row, col, maxWeight, maxVolume) {
        
        let p = new Position(positionID, aisleID, row, col, maxWeight, maxVolume, 0, 0);
        return PersistentManager.store(Position.tableName, p);

    }

    async listAllPositions() {
        let positions = await PersistentManager.loadAllRows(Position.tableName);
        return positions;
    }

    async modifyPosition(positionID, aisleID, row, col, max_weight, max_volume, occupied_weight, occupied_volume) {

        let exists = await PersistentManager.exists(Position.tableName, 'id', positionID);
        if (!exists) {
            return Promise.reject("404 position");
        }

        let newPositionId = aisleID + row + col;
        let p = new Position(newPositionId, aisleID, row, col, max_weight, max_volume, occupied_weight, occupied_volume);

        //Check if there is an associated sku and it can actually be stored when the max_weight and volume change

        let relativeSKU = await PersistentManager.loadOneByAttribute('position', SKU.tableName, positionID);
        if (relativeSKU) {
            const aq = relativeSKU.availableQuantity;
             const v = relativeSKU.volume;
            const w = relativeSKU.weight;
            //Check if the new position can store the sku
            const canItStore = p.canItStore(aq * w, aq * v);

        if (!canItStore) {
            return Promise.reject("422 cant store sku")
            }
        }


        //The position attribute in SKU will be automatically updated because in the db 
        //we put ON UPDATE CASCADE in the foreign key
        return PersistentManager.update(Position.tableName, p, 'id', positionID);


        
    }

    async changePositionID(oldID, newID) {
        
        const exists = await PersistentManager.exists(Position.tableName, 'id', oldID);
        if (!exists) {
            return Promise.reject("404 position");
        }
        
        //Divides the newID in 3 parts
        let coords = newID.match(/.{1,4}/g);
        let aisle = coords[0];
        let row = coords[1];
        let col = coords[2];
        let p = {
            id: newID,
            aisle: aisle,
            row: row,
            col: col
        }
        let oldPosition = await this.loadPositionById(oldID);
        

        return PersistentManager.update(Position.tableName, p, 'id', oldID);
        

    }
    
    async deletePosition(id) {
        return PersistentManager.delete('id', id, Position.tableName);
    }

    async existsPosition(id) {
        return PersistentManager.exists(Position.tableName, 'id', id);
    }

    async loadPositionById(id) {
        return PersistentManager.loadOneByAttribute('id',Position.tableName, id);
    }


    async _loadSkus(id) {
        let sku
        await PersistentManager.loadOneByAttribute('position', SKU.tableName, id).then(
            result => {
                sku = result;
            },
            error => {
                console.log(error);
            }  
        );
        return sku;

    }

}


module.exports = new PositionManager();