'use strict'

class Position {
    constructor (id, aisle, row, col, max_weight, max_volume, occupied_weight, occupied_volume, relativeSKU) {
        this.id = id;
        this.aisle = aisle;
        this.row = row;
        this.col = col;
        this.max_weight = max_weight; 
        this.max_volume = max_volume;
        this.occupied_weight = occupied_weight;
        this.occupied_volume = occupied_volume;
        this.relativeSKU = relativeSKU;
    }
}

module.exports = Position;