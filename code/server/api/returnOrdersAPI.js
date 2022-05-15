'use strict'
const ReturnOrderManager = require('../bin/controller/ReturnOrderManager');
const ReturnOrder = require('../bin/model/ReturnOrder')
const { validationResult } = require('express-validator');
const RestockOrder = require('../bin/model/RestockOrder');


//getall
exports.getAllReturnOrders= function(req,res){
    let result = ReturnOrderManager.listAllReturnOrders();
    result.then(
        result=>{
            return res.status(200).json();
        },
        error=>{
            console.log(error)
        }
    )

}

//getbyid
exports.getAllReturnOrderById = function(req,res){
    let returnOId = req.params.id;
    let result =  ReturnOrderManager.getReturnOrderByID(returnOId);
    result.then(
        result=>{
            return res.status(200).json();
        },
        error=>{
            console.log(error);
        }
    )
}

const dateValidation = function(date) {
    const yyyymmddRegex = new RegExp(/^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/);
    const withHours = new RegExp(/^\d{4}\/[0-1][0-2]\/[0-3]\d\s([0-1][0-9]|2[0-3]):[0-5]\d$/);
    if(yyyymmddRegex.exec(date) || withHours.exec(date)) {
        return true;
    }
    return false;
}


//post
exports.postReturnOrder=function(req,res){
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "Validation of request body failed"
        });
    }
    let date = req.body.returnDate;
    let roId = req.body.restockOrderId;
    let productsList = req.body.products;

    if (!dateValidation(date)) {
        return res.status(422).json({error: "date validation failed"});
    }



    let result = ReturnOrderManager.defineReturnOrder( date,productsList,roId);
    result.then(
        result=>{
            return res.status(201).json();
        },
        error=>{
            console.log(error);
        }
    )
}

//delete
exports.deleteReturnOrder=function(req,res){
    let returnOID= req.params;
    let result = ReturnOrderManager.deleteReturnOrder(returnOID);
    result.then(
        result=>{
            return res.status(204).json();
        }, 
        error=>{
            console.log(error);
        }
    )
}
//