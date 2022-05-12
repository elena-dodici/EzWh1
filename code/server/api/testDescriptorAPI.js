'use strict';
const TestDescriptor = require('../bin/model/TestDescriptor');
const QualityTestManager = require('../bin/controller/QualityTestManager');

exports.postTestDescriptor = function(req,res) {
    
    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({error: 'Empty body request'});
    }

    let name = req.body.name;
    let procedureDescription = req.body.procedureDescription;
    let idSKU= req.body.idSKU;
    //validation to do


    QualityTestManager.defineTestDescriptor(name, procedureDescription, idSKU).then( 
        result => {
            return res.status(201).json();
        },
        error => {
            return res.status(503).json({error: 'Generic error'});
        }
    );
}

exports.getTestDescriptors = function(req,res) {
    
        QualityTestManager.getAllTestDescriptors().then(
            result => {
                return res.status(200).json(result);
            },
            error => {
                return res.status(503).json({error: 'Generic error'});
            }
        )
 }
    
exports.getTestDescriptorByID = function(req,res) {
        let id = req.params.id;
        
        
        QualityTestManager.getTestDescriptorByID(id).then(
            result => {
                return res.status(200).json(result);
            },
            error => {
                return res.status(503).json({error: 'Generic error'});
            }
        )
 }
    
exports.modifyTestDescriptorById = function(req,res) {
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({error: 'Empty body request'});
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
                return res.status(503).json({error: 'Generic error'});
            }
        )
 }
    
    
exports.deleteTestDescriptor = function (req,res) {
        const id = req.params.id;
  
        QualityTestManager.deleteTestDescriptor(id).then(
            result => {
                return res.status(204).json();
            },
            error => {
                return res.status(503).json({error: 'Generic error'});
            }
        )
 }



