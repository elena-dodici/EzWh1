const SKU = require('../bin/model/SKU');
const SKUManager = require('../bin/controller/SKUManager');
const {validationResult} = require('express-validator');



exports.postSchema = {
    description: {
        notEmpty: true,
        errorMessage: "Description cannot be empty"
    },
    
    weight: {
        notEmpty: true,
        isFloat: {
            options: { min: 0}
        },
        errorMessage: "weight value incorrect"
    },
    volume: {
        notEmpty: true,
        isFloat: {
            options: { min: 0}
        },
        errorMessage: "volume value incorrect"
    },
    price: {
        notEmpty: true,
        isFloat: {
            options: { min: 0}
        },
        errorMessage: "price value incorrect"
    },
    notes: {
        notEmpty: true,
        errorMessage: "notes value incorrect"
    },
    availableQuantity: {
        notEmpty: true,
        isInt: {
            options: { min: 0}
        },
        errorMessage: "available quantity value incorrect"
    }
}

exports.postSKU = function(req,res) {
    const errors = validationResult(req);


    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "validation of request body failed"
        });
    }

    let description = req.body.description;
    let weight = req.body.weight;
    let volume = req.body.volume;
    let price = req.body.price;
    let notes = req.body.notes;
    let availableQuantity = req.body.availableQuantity;


    SKUManager.defineSKU(description, weight, volume, price, notes, availableQuantity).then( 
        result => {
            return res.status(201).end();
        },
        error => {
            return res.status(503).json({error: "generic error"});
        }
    );
}

exports.getSKUS = function(req,res) {
    
    SKUManager.listAllSKUs().then(
        result => {
            return res.status(200).json(result);
        },
        error => {
            return res.status(500).json({error: "generic error"});
        }
    )
}



exports.getSKUByID = function(req,res) {
    let id = req.params.id;

    if (id<0) {
        return res.status(422).json({error: "Validation of id failed"});
    }
    
    SKUManager.getSKUByID(id).then(
        result => {
            if (result) {
                return res.status(200).json(result);
            }
            else {
                return res.status(404).json({error: "no SKU associated to id"});
            }
        },
        error => {
            return res.status(500).json({error: "generic error"});
        }
    )
}


exports.modifySKUByIdSchema = {
    newDescription: {
        notEmpty: true,
        errorMessage: "Description cannot be empty"
    },
    
    newWeight: {
        notEmpty: true,
        isFloat: {
            options: { min: 0}
        },
        errorMessage: "weight value incorrect"
    },
    newVolume: {
        notEmpty: true,
        isFloat: {
            options: { min: 0}
        },
        errorMessage: "volume value incorrect"
    },
    newPrice: {
        notEmpty: true,
        isFloat: {
            options: { min: 0}
        },
        errorMessage: "price value incorrect"
    },
    newNotes: {
        notEmpty: true,
        errorMessage: "notes value incorrect"
    },
    newAvailableQuantity: {
        notEmpty: true,
        isInt: {
            options: { min: 0}
        },
        errorMessage: "available quantity value incorrect"
    }
}

exports.modifySKUById = function(req,res) {
    
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "validation of request body failed or if with newAvailableQuantity position is not capable enough in weight or in volume"
        });
    }

    
    const id = req.params.id;
    const newDescription = req.body.newDescription;
    const newWeight = req.body.newWeight;
    const newVolume = req.body.newVolume;
    const newPrice = req.body.newPrice;
    const newNotes = req.body.newNotes;
    const newQuantity = req.body.newAvailableQuantity;

    SKUManager.modifySKU(id, newDescription, newWeight, newVolume, newPrice, newNotes, newQuantity).then(
        result => {
            return res.status(200).end();
            
        },
        error => {
            switch (error) {
                case "404":
                    return res.status(404).json({error: "SKU not existing"});
                    break;
                case "422 position not capable":
                    return res.status(422).json({error: "validation of request body failed or if with newAvailableQuantity position is not capable enough in weight or in volume"});
                    break;
                default:
                    return res.status(503).json({error: "generic error"});
                    break;
            }
        }
    )
}

exports.putPositionToSkuSchema = {
    position: {
        isNumeric: true,
        isLength: {
            options: {min: 12, max: 12}
        }
    }
}

exports.putPositionToSku = function(req,res) {
    const id = req.params.id;
    const position = req.body.position;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "validation of position through the algorithm failed or position isn't capable to satisfy volume and weight constraints for available quantity of sku or position is already assigned to a sku"
        });
    }

    
    SKUManager.setPosition(id, position).then(
        result => {
            return res.status(200).json();
        },
        error => { 
            switch (error) {
                case "404 position":
                    return res.status(404).json({error: "Position not existing or SKU not existing"});
                    break;
                case "404 SKU":
                    return res.status(404).json({error: "Position not existing or SKU not existing"});
                    break;
                case "422 position not capable":
                    return res.status(422).json({error: "newAvailableQuantity position is not capable enough in weight or in volume"});
                    break;
                default:
                    return res.status(503).json({error: "generic error"});
                    break;
            }
        }
    )
}

exports.deleteSKU = function (req,res) {
    const id = req.params.id;

    if(id<0) {
        return res.status(422).json({error: "Validation of id failed"});
    }

    SKUManager.deleteSKU(id).then(
        result => {
            return res.status(204).json();
        },
        error => {
            switch (error) {
                case "422 availabiliy not 0":
                    return res.status(503).json({error: "generic error"})
                default: 
                    return res.status(503).json({error: "generic error"})
                
            }
        }
    )
}