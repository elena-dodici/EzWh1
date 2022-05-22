const chai = require('chai');
const chaiHttp = require('chai-http');
const QualityCheckManager = require('../bin/controller/QualityTestManager');
const SKUManager = require('../bin/controller/SKUManager');
const PersistentManager = require('../bin/DB/PersistentManager');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);


describe('test scenarios 12-1 12-2 12-3', async () => {

    before(async () => {
        await PersistentManager.deleteAll("Item");
        await PersistentManager.deleteAll("SKU");
        sku_id = await SKUManager.defineSKU("description",1,1,1,"notes",1);
        
    })
   
    newTestDescriptor(201, "name", "procedure", sku_id);
    newTestDescriptor(422, 12345, "procedure", sku_id);
    newTestDescriptor(422, "name", 12345 , sku_id);
    newTestDescriptor(422, "name", "procedure", "invalid idSKU");
    newTestDescriptor(422, "name", "procedure", -sku_id);
    newTestDescriptor(404, "name", "procedure", 1000);

    modifyTestDescription(200, 1, "new procedure");
    modifyTestDescription(422, 1, 12345);
    modifyTestDescription(422, "invalid id", "new procedure");
    modifyTestDescription(422, -1, "new procedure");
    modifyTestDescription(404, 1000, "procedure");

    deleteTestDescriptor(204, 1);
    deleteTestDescriptor(422, "invaid id");
    deleteTestDescriptor(422, -2);
    
});

//Scenario 12-1
function newTestDescriptor(expectedHTTPStatus, name, procedureDescription, idSKU) {
    it('adding a new Test Descriptor', function (done) {
        let testDescriptor = {
            name: name,
            procedureDescription: procedureDescription,
            idSKU: idSKU
        }
        agent.post('/api/testDescriptor')
            .send(testDescriptor)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

//Scenario 12-2
async function modifyTestDescription(expectedHTTPStatus, id, newProcedureDescription) {
    it('modifying Test Descriptor by Id' , function (done) {
        agent.get(`/api/testDescriptors/${id}`).then(
            function (res) {
                testDescriptor = res.body;
                const newTestDescriptor = {
                    name: testDescriptor.name,
                    procedureDescription: newProcedureDescription, 
                    idSKU: testDescriptor.idSKU
                };
                agent.put(`/api/testDescriptor/${id}`)
                .send(newTestDescriptor)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
            });
    });
}

//Scenario 12-3
async function deleteTestDescriptor(expectedHTTPStatus, id) {
    it('delete position', function(done) {
        agent.delete(`/api/testDescriptor/${id}`).then(
            function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }
        )
    })
}

