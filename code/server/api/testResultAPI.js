'use strict';
const TestResult = require('../bin/model/TestResult');
const QualityTestManager = require('../bin/controller/QualityTestManager');
const { validationResult } = require('express-validator');

const dateValidation = function(date) {
    const yyyymmddRegex = new RegExp(/^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/);
    const withHours = new RegExp(/^\d{4}\/[0-1][0-2]\/[0-3]\d\s([0-1][0-9]|2[0-3]):[0-5]\d$/);
    if(yyyymmddRegex.exec(date) || withHours.exec(date)) {
        return true;
    }
    return false;
}

exports.postTestResultSchema = {
    rfid: {
        notEmpty: true,
        isNumeric: true,
        isLength: {
            options: {min: 32, max: 32}
        },
        errorMessage: "rfid value incorrect"
    },
    idTestDescriptor: {
        notEmpty: true,
        isInt: {
            options: {min: 0}
        },
        errorMessage: "idTestDescriptor value incorrect"
    },
    Date: {
        notEmpty: true,
        errorMessage: "Date cannot be empty"
    },
    Result: {
        notEmpty: true,
        errorMessage: "Result cannot be empty"
    }
}

exports.postTestResult = function(req,res) {
    
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "Validation of request body failed"
        });
    }
    
    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({error: 'Empty body request'});
    }

    let rfid = req.body.rfid;
    let Date = req.body.Date;
    let Result= req.body.Result;
    let idTestDescriptor= req.body.idTestDescriptor;
    
    
    //Date validation
    if (!dateValidation(Date)) {
        return res.status(422).json({error: "date validation failed"});
    }

    QualityTestManager.defineTestResult(rfid,Date,Result,idTestDescriptor).then( 
        result => {
            return res.status(201).json();
        },
        error => {
            switch (error) {
                case "404 rfid not found":
                    return res.status(404).json({error: "no sku item associated to rfid"});
                case "404 TestDescriptor not found":
                    return res.status(404).json({error: "no test descriptor associated to idTestDescriptor"})
                default: 
                    return res.status(503).json({error: "generic error"});
            }
        }
    );
}

exports.getTestResults = function(req,res) {
        let rfid = req.params.rfid;

        if (rfid<0) {
            return res.status(422).json({error: "validation of rfid failed"});
        }
    
        QualityTestManager.getAllTestResultsByRFID(rfid).then(
            result => {
                if (result.length == 0) {
                    return res.status(404).json({error: "no sku item associated to rfid"});
                }
                else if (result) {
                    return res.status(200).json(result);
                }
            },
            error => {
                return res.status(500).json({error: 'generic error'});
            }
        )
}
    
 exports.getTestResultByID = function(req,res) {
  
        let id = req.params.id;
        let rfid = req.params.rfid;

        if (rfid<0) {
            return res.status(422).json({error: "validation of rfid failed"});
        }

        if (id<0) {
            return res.status(422).json({error: "validation of id failed"});
        }
        
        
        QualityTestManager.getTestResultByID(id,rfid).then(
            result => {
                if (result.length == 0) {
                    return res.status(404).json({error: "no test result associated to id or no sku item associated to rfid"});
                }
                else if (result) {
                    return res.status(200).json(result);
                }
            },
            error => {
                return res.status(500).json({error: 'generic error'});
        }
        )
}

exports.modifyTestResultByIdSchema = {
    newIdTestDescriptor: {
        notEmpty: true,
        isInt: {
            options: {min: 0}
        },
        errorMessage: "newIdTestDescriptor value incorrect"
    },
    newDate: {
        notEmpty: true,
        errorMessage: "newDate cannot be empty"
    },
    newResult: {
        notEmpty: true,
        errorMessage: "newResult cannot be empty"
    }
}
    
 exports.modifyTestResultById = function(req,res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "Validation of request body failed"
        });
    }

        const id = req.params.id;
        const rfid = req.params.rfid;
        const newIdTestDescriptor = req.body.newidTestDescriptor;
        const newDate = req.body.newDate;
        const newResult = req.body.newResult;

        if (rfid<0) {
            return res.status(422).json({error: "validation of rfid failed"});
        }

        if (id<0) {
            return res.status(422).json({error: "validation of id failed"});
        }

        if (!dateValidation(newDate)) {
            return res.status(422).json({error: "date validation failed"});
        }
    
        QualityTestManager.modifyTestResultByID(id,rfid, newIdTestDescriptor, newDate,  newResult).then(
            result => {
                return res.status(200).json();
            },
            error => {
                switch (error) {
                    case "404 rfid not found":
                        return res.status(404).json({error: "SKUitem not existing"});
                        break;
                    case "404 TestDescriptor id not found":
                        return res.status(404).json({error: "TestDescriptor not existing"});
                        break;
                    case "404 TestResult id not found":
                        return res.status(404).json({error: "TestResult not existing"});
                        break;
                    default:
                        return res.status(503).json({error: "generic error"});
                        break;
                }
            }
        )
}
    
    
exports.deleteTestResult = function (req,res) {
        const id = req.params.id;
        const rfid = req.params.rfid;
     
        if (rfid<0) {
            return res.status(422).json({error: "validation of rfid failed"});
        }

        if (id<0) {
            return res.status(422).json({error: "validation of id failed"});
        }
  
        QualityTestManager.deleteTestResult(id,rfid).then(
            result => {
                return res.status(204).json();
            },
            error => {
                switch (error) {
                    case "404":
                        return res.status(404).json({error: "TestResult not existing"});
                    default: 
                        return res.status(503).json({error: "generic error"});
                    
                }
            }
        )
 }
