const SKU = require('../bin/model/SKU')
const SKUManager = require('../bin/controller/SKUManager')

exports.postSKU = function(req,res) {
    
    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({error: 'Empty body request'});
    }

    let description = req.body.description;
    let weight = req.body.weight;
    let volume = req.body.volume;
    let price = req.body.price;
    let notes = req.body.notes;
    let availableQuantity = req.body.availableQuantity;
    //validation to do


    SKUManager.defineSKU(description, weight, volume, price, notes, availableQuantity).then( 
        result => {
            return res.status(201).json();
        },
        error => {
            console.log(error);
        }
    );
}

exports.getSKUS = function(req,res) {
    
    SKUManager.listAllSKUs().then(
        result => {
            return res.status(200).json(result);
        },
        error => {
            console.log(error);
        }
    )
}

exports.getSKUByID = function(req,res) {
    let id = req.params.id;
    
    
    SKUManager.getSKUByID(id).then(
        result => {
            return res.status(200).json(result);
        },
        error => {
            console.log(error);
        }
    )
}

exports.modifySKUById = function(req,res) {
    const id = req.params.id;
    const newDescription = req.body.newDescription;
    const newWeight = req.body.newWeight;
    const newVolume = req.body.newVolume;
    const newPrice = req.body.newPrice;
    const newNotes = req.body.newNotes;
    const newQuantity = req.body.newAvailableQuantity;

    SKUManager.modifySKU(id, newDescription, newWeight, newVolume, newPrice, newNotes, newQuantity).then(
        result => {
            return res.status(200).json();
        },
        error => {
            //to handle
            console.log(error);
        }
    )
}

exports.putPositionToSku = function(req,res) {
    const id = req.params.id;
    const position = req.body.position;

    
    SKUManager.setPosition(id, position).then(
        result => {
            return res.status(200).json();
        },
        error => { 
            //to handle
            console.log(error);
        }
    )
}

exports.deleteSKU = function (req,res) {
    const id = req.params.id;

    SKUManager.deleteSKU(id).then(
        result => {
            return res.status(204).json();
        },
        error => {
            console.log(error);
        }
    )
}