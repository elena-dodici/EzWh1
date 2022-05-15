'use strict';
const RestockOrderManager = require('../bin/controller/RestockOrderManager');
const { validationResult } = require('express-validator');


const dateValidation = function(date) {
    const yyyymmddRegex = new RegExp(/^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/);
    const withHours = new RegExp(/^\d{4}\/[0-1][0-2]\/[0-3]\d\s([0-1][0-9]|2[0-3]):[0-5]\d$/);
    if(yyyymmddRegex.exec(date) || withHours.exec(date)) {
        return true;
    }
    return false;
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

    let issue_date = req.body.issue_date;
    let supplierId = req.body.supplierId;
    let productsList = req.body.products;

    if (!dateValidation(issue_date)) {
        return res.status(422).json({error: "date validation failed"});
    }

    let result = RestockOrderManager.defineRestockOrder(issue_date, productsList,supplierId);
    
    result.then(
        result => {
            return res.status(201).json(result);
        },
        error => {
            error:errors.array();
            return res.status(501).json({error: 'generic error'})
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

    let roID = req.params.roID;     
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
    let result = RestockOrderManager.getRestockOrderByID(id);
    result.then(
        result => {
            return res.status(200).json(result);
        },
        error => {
            
            return res.status(500).json(error);
        }
    )
    
}

exports.getItemsById = function(req,res) {
    let id = req.params.id;
    let result = RestockOrderManager.getItemsById(id);
    result.then(
        result => {
            return res.status(200).json(result);
        },
        error => {
            
            return res.status(500).json(error);
        }
    )
    
}

exports.updateState = function(req,res) { 
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "Validation of request body failed"
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
            
            return res.status(500).json(error);
        }
    )
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
            return res.status(500).json(error);
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
            return res.status(500).json(error);
        }
    )

}



