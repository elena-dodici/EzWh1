'use strict'

class Position {
    static tableName = 'Position';
    
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

    //Checks if position ID is in a valid format
    isIdValid() {
        if (this.id) {
            let idString = '' + this.id;
            if (idString.length !== 12) {
                return false;
            }
            //divides position in 3 parts (aisle, row and col)
            let coords = this.id.match(/.{1,4}/g);
            let aisle = coords[0];
            let row = coords[1];
            let col = coords[2];
            if (aisle != this.aisle || row != this.row || col != this.col) {
                return false;
            }
            return true;
        }
        else {
            return false;
        }
    }

    isFormCorrect() {
        let isCorrect = true;
        const fourDigits = new RegExp('^([0-9]{4})$');
        const twelveDigits = new RegExp('^([0-9]{12})$');
        if (!this.id.match(twelveDigits) || !this.aisle.match(fourDigits) || !this.row.match(fourDigits) || !this.col.match(fourDigits)) {
            
            isCorrect = false;
        }
        if (isNaN(this.max_weight) || isNaN(this.max_volume)) {
            
            isCorrect = false;
        }
        else if (!Math.sign(this.max_weight) || !Math.sign(this.max_volume)) {
            isCorrect = false;
        }
        
        if (this.occupied_volume) {
            if (isNaN(this.occupied_volume)) {
                isCorrect = false;
            }
            else if (!Math.sign(this.occupied_volume)) {
                isCorrect = false;
            }
        } 
        if (this.occupied_weight) {
            if (isNaN(this.occupied_weight)) {
                isCorrect = false;
            }
            else if (!Math.sign(this.occupied_weight)) {
                isCorrect = false;
            }
        } 

        return isCorrect;
    }
}

module.exports = Position;