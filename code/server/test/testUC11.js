const chai = require('chai');
const chaiHttp = require('chai-http');
const ItemManager = require('../bin/controller/ItemManager');
const UserManager = require('../bin/controller/UserManager');
const SKUManager = require('../bin/controller/SKUManager');
const PersistentManager = require('../bin/DB/PersistentManager');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);


describe('test scenarios 11-1 11-2', async () => {

    before(async () => {
        await PersistentManager.deleteAll("Item");
        await PersistentManager.deleteAll("User");
        await PersistentManager.deleteAll("SKU");
        sku_id = await SKUManager.defineSKU("des",1,1,1,"notes",1);
        user_id = await UserManager.defineUser("john", "jo", "password", "supp@supp.it", "supplier");
        
    })
    newItem(201, "description", 12.14, sku_id, user_id);
    newItem(422, 12345, 12.14, sku_id, user_id);
    newItem(422, "description", "invalid price", sku_id, user_id);
    newItem(422, "description", 12.14, "invalid SKUId", user_id);
    newItem(422, "description", 12.14, sku_id, "invalid supplierId");
    newItem(422, "description", -12.14, sku_id, user_id);
    newItem(422, "description", 12.14, -sku_id, user_id);
    newItem(422, "description", 12.14, sku_id, -user_id);
    newItem(404, 12345, 12.14, 1000, user_id);
    newItem(404, 12345, 12.14, sku_id, 1000);

    modifyItem(200, 1, "new description", 10.11);
    modifyItem(422, 1, 12345, 10.11);
    modifyItem(422, 1, "new description", "invalid new price");
    modifyItem(422, "invalid id", "new description", 10.11);
    modifyItem(422, -1, "new description", 10.11);
    modifyItem(422, 1, "new description", -10.11);
    modifyItem(404, 1000, "new description", 10.11);
    

});

//Scenario 11-1
function newItem(expectedHTTPStatus, description, price, SKUId, supplierId) {
    it('adding a new Item', function (done) {
        let item = {
            description: description,
            pice: price,
            SKUId: SKUId,
            supplierId: supplierId
        }
        agent.post('/api/item')
            .send(item)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

//Scenario 11-2
async function modifyItem(expectedHTTPStatus, id, newDescription, newPrice) {
    it('modifying Item by Id' , function (done) {

        const newItem = {newDescription: newDescription, newPrice: newPrice};
        agent.put(`/api/item/${id}`)
            .send(newItem)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}


