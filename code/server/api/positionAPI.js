'use strict';
const PositionManager = require('../bin/controller/PositionManager');

//POST /api/position
exports.postPosition = function(req,res) {
    //validation to do
    /*
    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({error: 'Empty body request'});
    }*/

    let positionID = req.body.positionID;
    let aisleID = req.body.aisleID;
    let row = req.body.row;
    let col = req.body.col;
    let maxWeight =  req.body.maxWeight;
    let maxVolume = req.body.maxVolume;
    
    PositionManager.definePosition(positionID, aisleID, row, col, maxWeight, maxVolume)

    return res.status(201).json();

};
