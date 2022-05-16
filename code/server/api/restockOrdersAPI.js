'use strict';
const RestockOrderManager = require('../bin/controller/RestockOrderManager');
const { validationResult } = require('express-validator');
const PersistentManager = require('../bin/DB/PersistentManager');
const TestResult = require('../bin/model/TestResult');
const RestockOrder = require('../bin/model/RestockOrder');


const dateValidation = function(date) {
    const yyyymmddRegex = new RegExp(/^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/);
    const withHours = new RegExp(/^\d{4}\/[0-1][0-2]\/[0-3]\d\s([0-1][0-9]|2[0-3]):[0-5]\d$/);
    if(yyyymmddRegex.exec(date) || withHours.exec(date)) {
        return true;
    }
    return false;
}

exports.postRestockOrderSchema = {
    issueDate: {
        notEmpty: true,
    },
    products: {
        notEmpty: true,
    },
    supplierId: {
        notEmpty: true,
        isNumeric: true,
    },
}

//POST /api/restockOrders
exports.postRestockOrder = function(req,res) {
    //validation to do   
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "Validation of request body failed"
        });
    }

    let issue_date = req.body.issueDate;
    let supplierId = req.body.supplierId;
    let productsList = req.body.products;

    // if (!dateValidation(issue_date)) {
    //     return res.status(422).json({error: "date validation failed"});
    // }
  
    let result = RestockOrderManager.defineRestockOrder(issue_date, productsList,supplierId);
    
    result.then(
        result => {
            return res.status(201).json(result);
        },
        error => {
            console.log(error)
            return res.status(503).json({error: 'generic error'})
        }
    )

};

exports.deleteRestockOrder = function(req,res) {
    
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "Validation of request body failed"
        });
    }

    let roID = req.params.id;     
    let result = RestockOrderManager.deleteRestockOrder(roID);  
    result.then( 
        result => {
            return res.status(200).json();
        },
        error => {
            console.log(error);
            return res.status(503).json({error: 'generic error'})
        }
    )
    
}

//get All orders
exports.getRestockOrder = function(req,res) {
    let result =  RestockOrderManager.getAllRestockOrder();
    result.then(
        result => {
            return res.status(200).json(result);
        },
        error => {
            console.log(error)
            return res.status(500).json({error: 'generic error'});
        }
    )
    
}


exports.getRestockIssuedOrder = function(req,res) {
    let result = RestockOrderManager.getAllIssuedOrder();
    result.then(
        result => {
            return res.status(200).json(result);
        },
        error => {
            
            return res.status(500).json(error);
        }
    )
    
}

exports.getRestockOrderById = function(req,res) {
    let id = req.params.id;
    if(isNaN(id)){
        res.status(422).send("id is not number.");
    }
    let result = RestockOrderManager.getRestockOrderByID(id);
    result.then(
        result => {
            return res.status(200).json(result);
        },
        error => {
            switch(error){
                case "404 No RestockOrder Found":
                        return res.status(404).json({error: "RestockOrder not existing"})
                        
                default:
                        return res.status(500).json({error: "generic error"});
                        
            }
            
        }
    )
    
}

exports.getItemsById = async function(req,res) {
    let id = req.params.id;
    if(isNaN(id)){
        res.status(422).send("id is not number.");
    }
    

    let result = RestockOrderManager.getItemsById(id);
    
    result.then(
        result => {
            return res.status(200).json(result);
        },
        error => {
            switch(error){
                case "404 RestockOrderid":
                    return res.status(404).json({error: "RestockOrderId not existing"})
            
                 default:
                    return res.status(500).json({error: "generic error"});
            }
        }
    )
    
}

exports.putStateSchema = {
    newState: {
        notEmpty: true,
    },
}



exports.updateState = function(req,res) { 
    let id=req.params.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "Validation of request body failed"
        });
    }  
    let rowID= req.params.id;

    if(isNaN(id)){
        res.status(422).send("id is not number.");
    }

    let newState = req.body.newState;
    let result = RestockOrderManager.modifyState(rowID, newState);
    result.then( 
        result => {
            return res.status(200).json();
        },
        error => {
            switch(error){
                case "404 RestockOrderid cannot found":
                    return res.status(404).json({error: "RestockOrderId not existing"})
            
                 default:
                    return res.status(503).json({error: "generic error"});
            }
            
            
        }
    )
}

exports.putTransportNoteSchema = {
    transportNote: {
        notEmpty: true,
    },
}
exports.addTransportNode = function(req,res) {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "Validation of request body failed"
        });
    }
    let id= req.params.id;
    let newTN = req.body.transportNote;
    

    let result = RestockOrderManager.updateTransportNote(id, newTN);
    result.then(
        result => {
            return res.status(200).json();
        },
        error => {
            switch(error){
                case "404 RestockOrderid cannot found":
                    return res.status(404).json({error: "RestockOrderId not existing"})
            
                 default:
                    return res.status(503).json({error: "generic error"});
            }
            
        }
    )

}

exports.updateSKUItems = function(req,res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "Validation of request body failed"
        });
    }
    let id= req.params.id;
    let newSkuitemsinfo = req.body.skuItems;
    
    let result = RestockOrderManager.putSKUItems(id, newSkuitemsinfo);
    result.then(
        result => {
            return res.status(200).json();
        },
        error => {
            switch(error){
                case "404 RestockOrderid cannot found":
                    return res.status(404).json({error: "RestockOrderId not existing"})
            
                
                case "422 The state of order is not DELIVERED":
                    return res.status(422).json({error: "422 The state of order is not DELIVERED"})
                
                default:     
                    return res.status(503).json({error: "generic error"});
            }
            
        }
    )

}



