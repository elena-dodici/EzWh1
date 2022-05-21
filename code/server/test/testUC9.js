const chai = require('chai');
const chaiHttp = require('chai-http');
const PersistentManager = require('../bin/DB/PersistentManager');
const InternalOrderManager = require('../bin/controller/InternalOrderManager');
const InternalOrder = require('../bin/model/InternalOrder')
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);
let IoId=null;


describe("test scenario 9-1 9-2 9-3", ()=>{

    
    before(async ()=>{
        await PersistentManager.deleteAll("InternalOrder");
        IoId = await InternalOrderManager.defineInternalOrder("2021/11/29 09:33",
                                                            [{"SKUId":12,"description":"a product","price":10.99,"qty":3},
                                                            {"SKUId":180,"description":"another product","price":11.99,"qty":3}],
                                                            null)
    })





modifyState(200,IoId,"ACCEPTED")
modifyState(200,IoId,"CANCELLED")
modifyState(200,IoId,"REFUSED")




//set availablity of skuitem to 0
    function modifyState(expectedHTTPStatus,id,newState){
        it('modifyState', async ()=>{ 
            //check sku item descrease correct qty in sku table and position? 
            
            
            agent.put(`/api/internalOrders/${id}`)
            .send(newState)
            .then(function(res){
                    res.should.have.status(expectedHTTPStatus);                 
                    agent.get(`/api/skus/${id}`)
                    .send()
                    .then(function(res){
                        res.should.have.status(expectedHTTPStatus);
                        
                    })
                }
            ); 


                            
        });
    }
});
