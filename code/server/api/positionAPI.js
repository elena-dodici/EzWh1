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