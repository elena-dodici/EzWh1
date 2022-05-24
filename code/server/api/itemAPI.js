'use strict';
const Item = require('../bin/model/Item');
const ItemManager = require('../bin/controller/ItemManager');
const {validationResult} = require('express-validator');

exports.postItemSchema = {
    id: {
        notEmpty: true,
        isInt: {options: {min:0}}
    },
    description: {
        notEmpty: true,
        errorMessage: "description cannot be empty"
    },
    
    price: {
        notEmpty: true,
        isFloat: {
            options: { min: 0}
        },
        errorMessage: "price value incorrect"
    },
    SKUId: {
        notEmpty: true,
        isInt: {
            options: { min: 0}
        },
        errorMessage: "SKUId value incorrect"
    },
    supplierId: {
        notEmpty: true,
        isInt: {
            options: { min: 0}
        },
        errorMessage: "supplierId value incorrect"
    }
}

exports.postItem = function(req,res) {
    const errors = validationResult(req);
    
    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({error: 'Empty body request'});
    }

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "validation of request body failed"
        });
    }
    let id = req.body.id;
    let description = req.body.description;
    let price = req.body.price;
    let SKUId= req.body.SKUId;
    let supplierId= req.body.supplierId;


    ItemManager.defineItem(id, description,price,SKUId,supplierId).then( 
        result => {
            return res.status(201).json();
        },
        error => {
            switch (error) {
                case "404 SKU not found":
                    return res.status(404).json({error: "SKU not existing"});
                    break;
                case "404 Supplier not found":
                    return res.status(404).json({error: "Supplier not existing"});
                    break;
                case "422 supplier already sells an Item with the same ID":
                    return res.status(422).json({error: "Supplier already sells an Item with the same ID"});
                    break;
                case "422 this supplier already sells an item with the same SKUId":
                    return res.status(422).json({error: "This supplier already sells an item with the same SKUId"});
                    break;
                default:
                    return res.status(503).json({error: "generic error"});
                    break;
            }
        }
    );
}

exports.getItems = function(req,res) {
    
        ItemManager.getAllItems().then(
            result => {
                return res.status(200).json(result);
            },
            error => {
                return res.status(500).json({error: 'generic error'});
            }
        )
 }

 exports.getItemByIDSchema = {
     id: {
         notEmpty: true,
         isInt: {options: {min: 0}}
     }
 }
    
exports.getItemByID = function(req,res) {
        let id = req.params.id;

        const errors = validationResult(req);
    

        if (!errors.isEmpty()) {
            return res.status(422).json({
                error: "validation of id failed"
            });
        }
        
        ItemManager.getItemByID(id).then(
            result => {
                if (result) {
                    return res.status(200).json(result);
                }
                else {
                    return res.status(404).json({error: "no item associated to id"});
                }
            },
            error => {
                return res.status(500).json({error: 'Generic error'});
            }
        )
 }

exports.modifyItemByIdSchema = {
    id: {
        notEmpty: true,
        isInt: {options: {min:0}}
    },
    newDescription: {
        notEmpty: true,
        errorMessage: "newDescription cannot be empty"
    },
    
    newPrice: {
        notEmpty: true,
        isFloat: {
            options: { min: 0}
        },
        errorMessage: "price value incorrect"
    }
}
    
exports.modifyItemById = function(req,res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "validation of request body failed"
        });
    }
        const id = req.params.id;
        const newDescription = req.body.newDescription;
        const newPrice = req.body.newPrice;
    
        ItemManager.modifyItem(id, newDescription, newPrice).then(
            result => {
                    return res.status(200).json(result);
            },
            error => {
                switch (error) {
                    case "404":
                        return res.status(404).json({error: "no item associated to id"});
                    default:
                        return res.status(503).json({error: 'Generic error'});
                }
            }
        )
}
    

exports.deleteItemSchema = {
    id: {
        notEmpty: true,
        isInt: {options: {min: 0}}
    }
}
exports.deleteItem = function (req,res) {
        const id = req.params.id;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                error: "validation of id failed"
            });
        }
  
        ItemManager.deleteItem(id).then(
            result => {
                return res.status(204).json();
            },
            error => {
                switch (error) {
                    case "404":
                        return res.status(404).json({error: "Item not existing"})
                    default: 
                        return res.status(503).json({error: "generic error"})
                    
                }
            }
        )
 }



