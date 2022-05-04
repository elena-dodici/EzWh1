const Position = require('../model/Position');
const PersistentManager = require('../DB/PersistentManager');

class PositionManager {

    

    constructor() {}

    definePosition(positionID, aisleID, row, col, maxWeight, maxVolume) {
        
        let p = new Position(positionID, aisleID, row, col, maxWeight, maxVolume, 0, 0, null);
        p.sku_id = null;
        delete p.relativeSKU;
        PersistentManager.store('Position', p);

    }

}


module.exports = new PositionManager();