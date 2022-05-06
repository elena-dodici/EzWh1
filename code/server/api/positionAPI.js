'use strict';
const PositionManager = require('../bin/controller/PositionManager');
const Position = require('../bin/model/Position');

//POST /api/position
exports.postPosition = function(req,res) {
    //validation to do
    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({error: 'Empty body request'});
    }

    let positionID = req.body.positionID;
    let aisleID = req.body.aisleID;
    let row = req.body.row;
    let col = req.body.col;
    let maxWeight =  req.body.maxWeight;
    let maxVolume = req.body.maxVolume;

    let p = new Position(positionID, aisleID, row, col, maxWeight, maxVolume);
    const isFormatCorrect = p.isFormCorrect();
    const isIdValid = p.isIdValid()

    if (!isFormatCorrect) {
        return res.status(422).json({error: 'Incorrect Request format'});
    }
    if (!isIdValid) {
        return res.status(422).json({error: 'Position ID  is not in the correct form or doesn\'t respect the aisle+row+col constraint.'});
    }
    
    let result = PositionManager.definePosition(positionID, aisleID, row, col, maxWeight, maxVolume)
    
    result.then(
        result => {
            return res.status(201).json();
        },
        error => {
            return res.status(503).json({error: 'generic error'})
        }
    )

};



exports.getPositions = function(req,res) {
    let result = PositionManager.listAllPositions();
    result.then(
        result => {
            result.forEach((p) => {
                delete p.sku_id
            });
            return res.status(200).json(result);
        },
        error => {
            //return res.status(500).json({error: 'generic error'})
            console.log(error);
        }
    )
    
}


exports.updatePosition = function(req,res) {
    
    let id= req.params.positionID;
    let aisle= req.body.newAisleID;
    let row= req.body.newRow;
    let col= req.body.newCol;
    let max_weight= req.body.newMaxWeight;
    let max_volume= req.body.newMaxVolume;
    let occupied_weight= req.body.newOccupiedWeight;
    let occupied_volume= req.body.newOccupiedVolume;

    let p = new Position(aisle+row+col, aisle, row, col, max_weight, max_volume, occupied_weight, occupied_volume);
    const isFormatCorrect = p.isFormCorrect();
    const isIdValid = p.isIdValid()

    if (!isFormatCorrect || !isIdValid) {
        return res.status(503).json({error: 'Invalid format'});
    }

    let exists = PositionManager.existsPosition(id)
    exists.then(
        foundRow => {
            if (foundRow) {
                let result = PositionManager.modifyPosition(id, aisle, row, col, max_weight, max_volume, occupied_weight, occupied_volume);
                    result.then( 
                        result => {
                            return res.status(200).json();
                        },
                        error => {
                            res.status(503).json({error: 'generic error'})
                        }
                    )
            }
            else {
                return res.status(404).json({error: 'no position associated to positionID'})
            }
        },
        reject => {
            return res.status(503).json({error: 'generic error'})
        }
    )

    
}

exports.changePositionID = function(req,res) {
    let id= req.params.positionID;
    let newID = req.body.newPositionID;
    

    let result = PositionManager.changePositionID(id, newID);
    result.then(
        result => {
            return res.status(200).json();
        },
        error => {
            return res.status(503).json({error: 'generic error'})
        }
    )

}

exports.deletePosition = function(req,res) {
    let id= req.params.positionID;
    

    let result = PositionManager.deletePosition(id);
    result.then(
        result => {
            return res.status(204).json();
        },
        error => {
            return res.status(503).json({error: 'generic error'})
        }
    )
}

