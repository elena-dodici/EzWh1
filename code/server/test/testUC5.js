const chai = require('chai');
const chaiHttp = require('chai-http');
const PositionManager = require('../bin/controller/PositionManager');
const SKUManager = require('../bin/controller/SKUManager');
const UserManager = require('../bin/controller/UserManager');
const PersistentManager = require('../bin/DB/PersistentManager');
const SKUItemManager = require('../bin/controller/SKUItemManager');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
const { expect } = require('chai');
const RestockOrderManager = require('../bin/controller/RestockOrderManager');
const ItemManager = require('../bin/controller/ItemManager');
var agent = chai.request.agent(app);


describe('test scenario 5-1-1', () => {
    let skuid = null;
    let supplierid = null;
    let item = null;
    let products = null;
    let date = null;
    let rfid = null;
    let roid = null;
    beforeEach(async () => {
        
        await PersistentManager.deleteAll("RestockOrder");
        await PersistentManager.deleteAll("User");
        await PersistentManager.deleteAll("SKU");
        await PersistentManager.deleteAll("Item");
        await PersistentManager.deleteAll("SKUItem");
        skuid = await SKUManager.defineSKU("des",1,1,1,"notes",1);
        supplierid = await UserManager.defineUser("john", "jo", "password", "supp@supp.it", "supplier");
        item = await ItemManager.defineItem(1,"des", 1, skuid, supplierid);
        products = [{"SKUId":skuid,"description":"a product","price":10.99,"qty":1}]
        date = "2021/11/29 09:33";
        roid = await RestockOrderManager.defineRestockOrder(date, products, supplierid);
        await RestockOrderManager.modifyState(roid, "DELIVERY");
        rfid = "40311480885985959917534647794760";
    })

    updateRestockOrder(201, 200, "DELIVERED")
    updateRestockOrderInvalid(201, 422, "wrongField", roid)
    updateRestockOrderInvalid(201, 422, "wrongField", roid)
    updateRestockOrderInvalid(201, 422, "DELIVERED", -1)
    updateRestockOrderInvalid(201, 422, "DELIVERED", "not a number")


    function updateRestockOrder(expectedHTTPStatusSKUItem, expectedHTTPStatus, state) {
        it('updating Delivered state', function (done) {
            const newState = {newState: state}
            const skuitem = {
                RFID: rfid,
                SKUId: skuid, 
                DateOfStock: date
            }
                agent.post('/api/skuitem').send(skuitem).then(
                    function (res) {
                        res.should.have.status(expectedHTTPStatusSKUItem);
                        agent.put(`/api/restockOrder/${roid}`).send(newState).then(
                            function (res) {
                                res.should.have.status(expectedHTTPStatus);
                                done();
                            }
                        )
                    }
                )
                    
        })
    }

    function updateRestockOrderInvalid(expectedHTTPStatusSKUItem, expectedHTTPStatus, state, rid) {
        it('updating Delivered state invalid', function (done) {
            const newState = {newState: state}
            const skuitem = {
                RFID: rfid,
                SKUId: skuid, 
                DateOfStock: date
            }
                agent.post('/api/skuitem').send(skuitem).then(
                    function (res) {
                        res.should.have.status(expectedHTTPStatusSKUItem);
                        agent.put(`/api/restockOrder/${rid}`).send(newState).then(
                            function (res) {
                                res.should.have.status(expectedHTTPStatus);
                                done();
                            }
                        )
                    }
                )
                    
        })
    }
})

describe('test scenario 5-2-1', () => {
    let skuid = null;
    let supplierid = null;
    let item = null;
    let products = null;
    let date = null;
    let rfid = null;
    let roid = null;
    beforeEach(async () => {
        
        await PersistentManager.deleteAll("RestockOrder");
        await PersistentManager.deleteAll("User");
        await PersistentManager.deleteAll("SKU");
        await PersistentManager.deleteAll("Item");
        await PersistentManager.deleteAll("SKUItem");
        skuid = await SKUManager.defineSKU("des",1,1,1,"notes",1);
        supplierid = await UserManager.defineUser("john", "jo", "password", "supp@supp.it", "supplier");
        item = await ItemManager.defineItem(1,"des", 1, skuid, supplierid);
        products = [{"SKUId":skuid,"description":"a product","price":10.99,"qty":1}]
        date = "2021/11/29 09:33";
        roid = await RestockOrderManager.defineRestockOrder(date, products, supplierid);
        await RestockOrderManager.modifyState(roid, "DELIVERED");
        rfid = "40311480885985959917534647794760";
    })

    updateRestockOrderTested(200, "TESTED")
    updateRestockOrderInvalidTested(422, "wrongField", roid)
    updateRestockOrderInvalidTested(422, "wrongField", roid)
    updateRestockOrderInvalidTested(422, "TESTED", -1)
    updateRestockOrderInvalidTested(422, "TESTED", "not a number")


    function updateRestockOrderTested(expectedHTTPStatus, state) {
        it('updating Delivered state to tested', function (done) {
            const newState = {newState: state}
            agent.put(`/api/restockOrder/${roid}`).send(newState).then(
                function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                }
            )
                    
        })
    }

    function updateRestockOrderInvalidTested(expectedHTTPStatus, state, rid) {
        it('updating Delivered state to tested', function (done) {
            const newState = {newState: state}
            agent.put(`/api/restockOrder/${rid}`).send(newState).then(
                function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                }
            )
                    
        })
    }
})















