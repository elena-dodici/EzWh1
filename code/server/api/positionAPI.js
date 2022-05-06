'use strict';
const PositionManager = require('../bin/controller/PositionManager');

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
    
    let result = PositionManager.definePosition(positionID, aisleID, row, col, maxWeight, maxVolume)
    
    result.then(
        result => {
            return res.status(201).json();
        },
        error => {
            console.log(error)
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
            console.log(error)
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
    

    let result = PositionManager.modifyPosition(id, aisle, row, col, max_weight, max_volume, occupied_weight, occupied_volume);
    result.then( 
        result => {
            return res.status(200).json();
        },
        error => {
            console.log(error);
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
            console.log(error);
        }
    )

}

