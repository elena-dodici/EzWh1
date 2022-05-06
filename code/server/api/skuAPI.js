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