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

}


module.exports = new PositionManager();