'use strict';
const RestockOrderManager = require('../bin/controller/RestockOrderManager');
const { validationResult } = require('express-validator');
const PersistentManager = require('../bin/DB/PersistentManager');
const TestResult = require('../bin/model/TestResult');
const RestockOrder = require('../bin/model/RestockOrder');
const SKU = require('../bin/model/SKU');

const possibleStates = ['ISSUED', 'DELIVERY', 'DELIVERED', 'TESTED', 'COMPLETEDRETURN', 'COMPLETED'];

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
        isInt: {
            option:{min:0}
        }
    },
    'products.*.SKUId': {
        notEmpty: true, 
        isNumeric: {
            options: {min: 0}
        }
    },
    'products.*.description': {
        notEmpty: true
    },
    'products.*.price': {
        notEmpty: true,
        isNumeric: true
    },
    'products.*.qty': {
        notEmpty: true, 
        isInt: {options: {min:0}}
    }
}

//POST /api/restockOrders
exports.postRestockOrder = function(req,res) {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            //errors: errors.array()
            error: "validation of request body failed"
        });
    }

    let issue_date = req.body.issueDate;
    let supplierId = req.body.supplierId;
    let productsList = req.body.products;

    if (!dateValidation(issue_date)) {
        return res.status(422).json({error: "validation of request body failed"});
    }
  
    let result = RestockOrderManager.defineRestockOrder(issue_date, productsList,supplierId);
    
    result.then(
        result => {
            return res.status(201).end();
        },
        error => {
            console.log(error);
            return res.status(503).json({error: 'generic error'})
        }
    )

};

exports.deleteRestockOrderSchema = {
    id: {
        notEmpty: true,
        isInt: {options: {min:0}}
    }
}

exports.deleteRestockOrder = function(req,res) {
    
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "Validation of id failed"
        });
    }

    let roID = req.params.id;     
    let result = RestockOrderManager.deleteRestockOrder(roID);  
    result.then( 
        result => {
            return res.status(200).json();
        },
        error => {
            switch(error){
                /* Not requested by api
                case "404 RestockOrderid cannot found":
                    return res.status(404).json({error: "404 RestockOrderid cannot found"})*/
                default:
                    return res.status(503).json({error: 'generic error'})
            }
            
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
            
            return res.status(500).json({error:"generic error"});
        }
    )
    
}

exports.getRestockOrderByIDSchema = {
    id: {
        notEmpty: true,
        isInt: {options: {min: 0}}
    }
}

exports.getRestockOrderById = function(req,res) {
    let id = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "Validation of id failed"
        });
    }  
    let result = RestockOrderManager.getRestockOrderByID(id);
    result.then(
        result => {
            return res.status(200).json(result);
        },
        error => {
            switch(error){
                case "404 No RestockOrder Found":
                        return res.status(404).json({error: "no restock order associated to id"})
                        
                default:
                        return res.status(500).json({error: "generic error"});
                        
            }
            
        }
    )
    
}

exports.getItemsByIdSchema = {
    id: {
        notEmpty: true,
        isInt: {options: {min:0}}
    }
}

exports.getItemsById = async function(req,res) {
    let id = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "validation of id failed or restock order state != COMPLETEDRETURN"
        });
    }  
    let result = RestockOrderManager.getItemsById(id);


    result.then(
        result => {
            return res.status(200).json(result);
        },
        error => {
            switch(error){
                case "404 RestockOrderid":
                    return res.status(404).json({error: "no restock order associated to id"});
                case "422 completedreturn":
                    return res.status(422).json({error: "validation of id failed or restock order state != COMPLETEDRETURN"})
                 default:
                    return res.status(500).json({error: "generic error"});
            }
        }
    )
    
}

exports.putStateSchema = {
    newState: {
        notEmpty: true,
        custom: {
            options: (value, { req, location, path }) => {
				if (possibleStates.includes(value)) {
					return true;
				} else {
					return false;
				}
			},
        }
    },
    id: {
        isInt: {options: {min: 0}}
    }
}



exports.updateState = function(req,res) { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            //error: errors.array()
            error: "validation of request body or of id failed"
        });
    }  
    let rowID= req.params.id;
    let newState = req.body.newState;
    let result = RestockOrderManager.modifyState(rowID, newState);
    result.then( 
        result => {
            return res.status(200).json();
        },
        error => {
            switch(error){
                case "404 RestockOrderid cannot found":
                    return res.status(404).json({error: "no restock order associated to id"})
            
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
    'transportNote.deliveryDate': {
        notEmpty: true,
        isDate: true
    },
    id: {
        isInt: {options: {min: 0}}
    }

}

//validation of request body or of id failed or order state != DELIVERY or deliveryDate is before issueDate
exports.addTransportNode = function(req,res) {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            
            error: "validation of request body or of id failed or order state != DELIVERY or deliveryDate is before issueDate"
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
            console.log(error)
            switch(error){
                case "404 RestockOrderid not found":
                    return res.status(404).json({error: "no restock order associated to id"})
            
                case "422 Order State is not delievered":
                        return res.status(422).json({error: "validation of request body or of id failed or order state != DELIVERY or deliveryDate is before issueDate"})
                
                case "422 Unprocessable Entity":
                        
                        return res.status(422).json({error: "validation of request body or of id failed or order state != DELIVERY or deliveryDate is before issueDate"})
                default:
                    return res.status(503).json({error: "generic error"});
            }
            
        }
    )

}

exports.putSKUItemsSchema = {
    skuItems: {
        notEmpty: true,
    },
    'skuItems.*.SKUId': {
        notEmpty: true,
        isInt: {options: {min:0}}
    },
    'skuItems.*.rfid': {
        notEmpty: true,
        isNumeric: true,
        isLength: {options: {min:32, max: 32}}
    }
    
}
exports.updateSKUItems = function(req,res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "validation of request body or of id failed or order state != DELIVERED"
        });
    }
    let id= req.params.id;
    let newSkuitemsinfo = req.body.skuItems;
    
    let result = RestockOrderManager.putSKUItems(id, newSkuitemsinfo);
    result.then(
        result => {
            return res.status(200).end();
        },
        error => {
            switch(error){
                case "404 RestockOrderid cannot found":
                    return res.status(404).json({error: "no restock order associated to id"})
            
                
                case "422 The state of order is not DELIVERED":
                    return res.status(422).json({error: "validation of request body or of id failed or order state != DELIVERED"})
                
                default:     
                    return res.status(503).json({error: "generic error"});
            }
            
        }
    )

}


