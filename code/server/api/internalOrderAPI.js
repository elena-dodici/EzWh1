'use strict'
const InternalOrderManager = require('../bin/controller/InternalOrderManager.js');



//post
exports.postInternalOrder = function(req,res){

    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({error: 'Empty body request'});
    }

    let issue_date = req.body.issueDate;
    let customerId = req.body.customerId;
    let productlist = req.body.products;
    let result =  InternalOrderManager.defineInternalOrder(issue_date,productlist,customerId);

   // let products
    result.then(
        result=>{
            return res.status(200).json();
        },
        error=>{
            console.log(error)
        }
    )
}


exports.deleteInternalOrder = function(req,res) {
// check delete id is exist!
   
    let roID = req.params.id;     
    let result = InternalOrderManager.deleteIO(roID);  
    result.then( 
        result => {
            return res.status(204).json();
        },
        error => {
            console.log(error);
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
            console.log(error)
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
            console.log(error)
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
            console.log(error)
        }
    )
    
}


exports.getinternalOrderById = function(req,res) {
    let id = req.params.id;
    let result = InternalOrderManager.listIOByID(id);
    result.then(
        result => {
            return res.status(200).json(result);
        },
        error => {
            console.log(error)
        }
    )
    
}


exports.changeInternalOrder = function(req,res) {   
    let rowID= req.params.id;
    let newState = req.body.newState;
    let ProductList = undefined;
    if(req.body.products!==undefined){
        ProductList = req.body.products;
       
    }   
   
    let result = InternalOrderManager.modifyState(rowID, newState,ProductList);
    result.then( 
        result => {
            return res.status(200).json();
        },
        error => {
            console.log(error);
        }
    )
}