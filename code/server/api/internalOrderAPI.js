'use strict'
const InternalOrderManager = require('../bin/controller/InternalOrderManager.js');
const { validationResult } = require('express-validator');

const dateValidation = function(date) {
    const yyyymmddRegex = new RegExp(/^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/);
    const withHours = new RegExp(/^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\s([0-1][0-9]|2[0-3]|[0-9]):[0-5]\d$/);
    if(yyyymmddRegex.exec(date) || withHours.exec(date)) {
        return true;
    }
    return false;
}

const possibleStates = ['ISSUED', 'ACCEPTED', 'REFUSED', 'CANCELED', 'COMPLETED'];

exports.postInternalOrderSchema = {
  
    issueDate: {
        notEmpty: true,
    },
    products: {
        notEmpty: true,
    },
    customerId: {
        notEmpty: true,
        isNumeric: {
            options: {min: 0}
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
    },
}
//post
exports.postInternalOrder = function(req,res){

    const errors = validationResult(req);

    
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "Validation of request body failed"
        });
    }

    let issue_date = req.body.issueDate;
    let customerId = req.body.customerId;
    let productlist = req.body.products;
    


    //Date validation
    if (!dateValidation(issue_date)) {
       
    
        return res.status(422).json({error: "Validation of request body failed"});
    }
    
    let result =  InternalOrderManager.defineInternalOrder(issue_date,productlist,customerId);
   
    // let products
    result.then(
        result=>{
            return res.status(201).end();
        },
        error=>{
            return res.status(500).json({error:"generic error"});
        }
    )
}


exports.deleteInternalOrderSchema = {
    id: {
        notEmpty: true,
        isInt: {options: {min:0}}
    }
}
exports.deleteInternalOrder = function(req,res) {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "Validation of id failed"
        });
    }
   
    let roID = req.params.id;     
    let result = InternalOrderManager.deleteIO(roID);  
    result.then( 
        result => {
            return res.status(204).end();
        },
        error => {
            return res.status(500).json({error:"generic error"});
        }
    )
    
}


exports.getAllInternalOrder = function(req,res) {   
    let result = InternalOrderManager.listAllInternalOrder();
    result.then(
        result => {
             return res.status(200).json(result);
        },
        error => {
            return res.status(500).json({error:"generic error"});
        }
    )
    
}


exports.getInternalOrderIssued = function(req,res) {
    let result = InternalOrderManager.listIssuedIO();
    result.then(
        result => {
             return res.status(200).json(result);
        },
        error => {
            return res.status(500).json({error:"generic error"});
        }
    )
    
}

exports.getinternalOrdersAccepted = function(req,res) {
    let result = InternalOrderManager.listAcceptedIO();
    result.then(
        result => {
            return res.status(200).json(result);
        },
        error => {
            return res.status(500).json({error:"generic error"});
        }
    )
    
}

exports.getinternalOrderByIdSchema = {
    id: {
        notEmpty: true,
        isInt: {options: {min:0}}
    }
}


exports.getinternalOrderById = function(req,res) {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "Validation of id failed"
        });
    }
 
    let id = req.params.id;
    let result = InternalOrderManager.listIOByID(id);
    result.then(
        result => {
            return res.status(200).json(result);
        },
        error => {
            switch(error){
                case "404 InternalOrderId cannot found":
                    return res.status(404).json({error: "no internal order associated to id"})
                default:     
                    return res.status(503).json({error: "generic error"});
            }
            
            
        }
    )
    
}

exports.putInternalOrdersSchema = {
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
    products: {
        optional: true
    },
    id: {
        isInt: { options: {min:0}}
    }
}

exports.changeInternalOrder = function(req,res) {  
    
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "Validation of request body or of id failed"
        });
    }
    let rowID= req.params.id;
    let newState = req.body.newState;
    let ProductList = undefined;
    if(req.body.products!==undefined){
        ProductList = req.body.products;
       
    }   
    
    let result = InternalOrderManager.modifyState(rowID, newState,ProductList);
    result.then( 
        result => {
            return res.status(200).end();
        },
        error => {
            switch(error){
                case "404 not found InternalOrder":
                    return res.status(404).json({error: "no internal order associated to id"})
            
                    /*
                    // not requested by the api
                case "Not available qty in DB":
                    return res.status(422).json({error: "generic error"})*/

                default:     
                    return res.status(503).json({error: "generic error"});
            }
        }
    )
}