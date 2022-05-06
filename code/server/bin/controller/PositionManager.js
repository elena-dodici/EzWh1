const Position = require('../model/Position');
const PersistentManager = require('../DB/PersistentManager');

class PositionManager {

    

    constructor() {}

    definePosition(positionID, aisleID, row, col, maxWeight, maxVolume) {
        
        let p = new Position(positionID, aisleID, row, col, maxWeight, maxVolume, 0, 0, null);
        p.sku_id = null;
        delete p.relativeSKU;
        return PersistentManager.store(Position.tableName, p);

    }

    listAllPositions() {
        let positions = PersistentManager.loadAllRows(Position.tableName);
        //For each position delete the sku_id because it's not needed in the API response
        return positions;
    }

    modifyPosition(positionID, aisleID, row, col, max_weight, max_volume, occupied_weight, occupied_volume) {
        let newPositionId = aisleID + row + col;
        let p = new Position(newPositionId, aisleID, row, col, max_weight, max_volume, occupied_weight, occupied_volume);
        delete p.relativeSKU;
        
        return PersistentManager.update(Position.tableName, p, 'id', positionID);

    }

    async changePositionID(oldID, newID) {
        //Check if old position exists, to do
        //let oldPosition = await this.loadPosition(oldID);
        //Validation of newID must be done
        //SKU is missing here
        //let oldID = oldPosition.id;
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

        return PersistentManager.update(Position.tableName, p, 'id', oldID);
    }
    
    async deletePosition(id) {
        return PersistentManager.delete('id', id, Position.tableName);
    }

    async existsPosition(id) {
        return PersistentManager.exists(Position.tableName, 'id', id);
    }

}


module.exports = new PositionManager();