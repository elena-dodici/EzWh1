'use strict';
const TestResult = require('../bin/model/TestResult');
const QualityTestManager = require('../bin/controller/QualityTestManager');

exports.postTestResult = function(req,res) {
    
    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({error: 'Empty body request'});
    }

    let rfid = req.body.rfid;
    let date = req.body.date;
    let result= req.body.result;
    let idTestDescriptor= req.body.idTestDescriptor;
    //validation to do

    QualityTestManager.defineTestResult(rfid,date,result,idTestDescriptor).then( 
        result => {
            return res.status(201).json();
        },
        error => {
            return res.status(503).json({error: 'Generic error'});
        }
    );
}

exports.getTestResults = function(req,res) {
        let rfid = req.params.rfid;
    
        QualityTestManager.getAllTestResultsByRFID(rfid).then(
            result => {
                return res.status(200).json(result);
            },
            error => {
                return res.status(503).json({error: 'Generic error'});
            }
        )
}
    
 exports.getTestResultByID = function(req,res) {
  
        let id = req.params.id;
        let rfid = req.params.rfid;
        
        
        QualityTestManager.getTestResultByID(id,rfid).then(
            result => {
                return res.status(200).json(result);
            },
            error => {
                return res.status(503).json({error: 'Generic error'});
            }
        )
}
    
 exports.modifyTestResultById = function(req,res) {
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({error: 'Empty body request'});
        }

        const id = req.params.id;
        const rfid = req.params.rfid;
        const newResult = req.body.newResult;
        const newDate = req.body.newDate;
        const newidTestDescriptor = req.body.newidTestDescriptor;
    
        QualityTestManager.modifyTestResultByID(id,rfid, newResult, newDate, newidTestDescriptor).then(
            result => {
                return res.status(200).json();
            },
            error => {
                return res.status(503).json({error: 'Generic error'});
            }
        )
}
    
    
exports.deleteTestResult = function (req,res) {
        const id = req.params.id;
        const rfid = req.params.rfid;
  
        QualityTestManager.deleteTestResult(id,rfid).then(
            result => {
                return res.status(204).json();
            },
            error => {
                return res.status(503).json({error: 'Generic error'});
            }
        )
 }
