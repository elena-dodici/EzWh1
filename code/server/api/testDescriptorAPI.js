'use strict';
const TestDescriptor = require('../bin/model/TestDescriptor');
const QualityTestManager = require('../bin/controller/QualityTestManager');
const {validationResult} = require('express-validator');

exports.postTestDescriptorSchema = {
    name: {
        notEmpty: true,
        errorMessage: "name cannot be empty"
    },
    
    procedureDescription: {
        notEmpty: true,
        errorMessage: "procedureDescrption cannot be empty"
    },
    idSKU: {
        notEmpty: true,
        isInt: {
            options: { min: 0}
        },
        errorMessage: "idSKU value incorrect"
    }
}

exports.postTestDescriptor = function(req,res) {
    const errors = validationResult(req);
    
    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({error: 'Empty body request'});
    }

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "validation of request body failed"
        });
    }

    let name = req.body.name;
    let procedureDescription = req.body.procedureDescription;
    let idSKU= req.body.idSKU;


    QualityTestManager.defineTestDescriptor(name, procedureDescription, idSKU).then( 
        result => {
            return res.status(201).json();
        },
        error => {
            if (error == "404") {
                return res.status(404).json({error: "no sku associated idSKU"})
            }
            else {
                return res.status(503).json({error: "generic error"})            
            }
        }
    );
}

exports.getTestDescriptors = function(req,res) {
    
        QualityTestManager.getAllTestDescriptors().then(
            result => {
                return res.status(200).json(result);
            },
            error => {
                return res.status(500).json({error: 'generic error'});
            }
        )
 }

 exports.getTestDescriptorByIDSchema = {
     id: {
         notEmpty: true,
         isInt: {
             options: {min: 0}
         }
     }
 }
    
exports.getTestDescriptorByID = function(req,res) {
        let id = req.params.id;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                error: "validation of id failed"
            });
        }
    
        
        QualityTestManager.getTestDescriptorByID(id).then(
            result => {
                if (result) {
                    return res.status(200).json(result);
                }
                else {
                    return res.status(404).json({error: "no test descriptor associated id"});
                }
            },
            error => {
                return res.status(500).json({error: 'Generic error'});
            }
        )
 }

exports.modifyTestDescriptorByIdSchema = {
    id: {
        notEmpty: true,
        isInt: {
            options: {min: 0}
        }
    },
    newName: {
        notEmpty: true,
        errorMessage: "newName cannot be empty"
    },
    
    newProcedureDescription: {
        notEmpty: true,
        errorMessage: "newProcedureDescrption cannot be empty"
    },
    newIdSKU: {
        notEmpty: true,
        isInt: {
            options: { min: 0}
        },
        errorMessage: "newidSKU value incorrect"
    }
}
    
exports.modifyTestDescriptorById = function(req,res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "validation of request body failed"
        });
    }
        const id = req.params.id;
        const newName = req.body.newName;
        const newProcedureDescription = req.body.newProcedureDescription;
        const newIdSKU = req.body.newIdSKU;
    
        QualityTestManager.modifyTestDescriptor(id, newName, newProcedureDescription, newIdSKU).then(
            result => {
                return res.status(200).json();
            },
            error => {
                switch (error) {
                    case "404 idSKU not found":
                        return res.status(404).json({error: "SKU not existing"});
                        break;
                    case "404 TestDescriptor id not found":
                        return res.status(404).json({error: "TestDescriptor not existing"});
                        break;
                    default:
                        return res.status(503).json({error: "generic error"});
                        break;
                }
            }
        )
 }

 exports.deleteTestDescriptorSchema = {
    id: {
        notEmpty: true,
        isInt: {
            options: {min: 0}
        }
    }
}
    
    
exports.deleteTestDescriptor = function (req,res) {
        const id = req.params.id;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                error: "validation of id failed"
            });
        }
    
  
        QualityTestManager.deleteTestDescriptor(id).then(
            result => {
                return res.status(204).json();
            },
            error => {
                switch (error) {
                    case "404":
                        return res.status(404).json({error: "TestDescriptor not existing"})
                    default: 
                        return res.status(503).json({error: "generic error"})
                    
                }
            }
        )
 }



