'use strict'
const ReturnOrderManager = require('../bin/controller/ReturnOrderManager');
const ReturnOrder = require('../bin/model/ReturnOrder')


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

//post
exports.postReturnOrder=function(req,res){
    if (Object.keys(req.body).length===0){
        return res.status(422).json({error:"Empty body request"})
    }
    let date = req.body.returnDate;
    let roId = req.body.restockOrderId;
    let productsList = req.body.products;
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