'use strict';
const RestockOrderManager = require('../bin/controller/RestockOrderManager');

//POST /api/restockOrders
exports.postRestockOrder = function(req,res) {
    //validation to do
    
    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({error: 'Empty body request'});
    }

    let issue_date = req.body.issue_date;
    let supplierId = req.body.supplierId;
    let productsList = req.body.products;
    let result = RestockOrderManager.defineRestockOrder(issue_date, productsList,supplierId);
    
    result.then(
        result => {
            return res.status(201).json();
        },
        error => {
            console.log(error)
        }
    )

};

exports.deleteRestockOrder = function(req,res) {

    let roID = req.params.roID;     
    let result = RestockOrderManager.deleteRestockOrder(roID);  
    result.then( 
        result => {
            return res.status(200).json();
        },
        error => {
            console.log(error);
        }
    )
    
}


exports.getRestockOrder = function(req,res) {
    let result = RestockOrderManager.getAllRestockOrder();
    result.then(
        result => {
            return res.status(200).json(result);
        },
        error => {
            console.log(error)
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
            console.log(error)
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
            console.log(error)
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
            console.log(error)
        }
    )
    
}

exports.updateState = function(req,res) {   
    let rowID= req.params.id;
    let newState = req.body.newState;
    let result = RestockOrderManager.modifyState(rowID, newState);
    result.then( 
        result => {
            return res.status(200).json();
        },
        error => {
            console.log(error);
        }
    )
}


exports.addTransportNode = function(req,res) {
    let id= req.params.id;
    let newTN = req.body.transportNote;
    

    let result = RestockOrderManager.updateTransportNote(id, newTN);
    result.then(
        result => {
            return res.status(200).json();
        },
        error => {
            console.log(error);
        }
    )

}

exports.updateSKUItems = function(req,res) {
    let id= req.params.id;
    let newSkuitemsinfo = req.body.skuItems;

    let result = RestockOrderManager.putSKUItems(id, newSkuitemsinfo);
    result.then(
        result => {
            return res.status(200).json();
        },
        error => {
            console.log(error);
        }
    )

}



