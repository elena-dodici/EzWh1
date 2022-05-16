const RestockOrder = require('../model/RestockOrder');
const PersistentManager = require('../DB/PersistentManager');
const TransportNote = require('../model/TransportNote')
const Item = require('../model/Item')
const ProductOrder = require('../model/ProductOrder')
const SKUItem = require('../model/SKUItem');
const SKU = require('../model/SKU');
const res = require('express/lib/response');
const User = require('../model/User');

class RestockOrderManager {
    constructor() { }

    async defineRestockOrder(issue_date, productsList, supplierId) {
       
        //validate supplierId exists
        const exists = await PersistentManager.exists(User.tableName, 'id', supplierId);
        if (!exists){
            return Promise.reject("404 no supplier Id found");
        }
        else{
            
            let ro = new RestockOrder(null, issue_date, "ISSUED", supplierId, null);               
                
            let newRestockOrderId= await PersistentManager.store(RestockOrder.tableName, ro)

            for (const product of productsList) {
                
                let newSkuid = product.SKUId;
                // let newPrice = product.price;
                let newqty = product.qty;

                let exists = await PersistentManager.exists(SKU.tableName, 'id', newSkuid);
                if(!exists){  
                    return Promise.reject("404 no sku Id found");
                }
                            
                //define a object and insert into DB
                let item_id = parseInt(newSkuid.toString()+ supplierId.toString());
                
                let newProductOrder = new ProductOrder  (null,newqty,newRestockOrderId,null);
                await PersistentManager.store(ProductOrder.tableName, newProductOrder).then(
                    result=>{
                        return result;
                    },
                    error=>{
                        console.log(error)
                        return Promise.reject("503 Fail to store in Product Order table")
                    }
                )
                    
                
            }
        }
        
    }

    async getAllRestockOrder() {       
        let restockOrders = await PersistentManager.loadAllRows(RestockOrder.tableName);
        //evertorder need to find transportnode + 2 list(for)

        let finalRes = [];
        // let eachOrderInfo = {};
         for (const order of restockOrders) {           
            let eachOrderInfo= await this.addOneOrderInfo(order);
            finalRes.push(eachOrderInfo);
         }     
         if(restockOrders.state!=="ISSUED") {
             finalRes.deliveryDate=[];
             finalRes.skuItems =[];
        }
         if(restockOrders.state!=="DELIVERY"){
            finalRes.skuItems =[];
         }
         return finalRes;
     }


    async getAllIssuedOrder() {
        let issueOrders =await PersistentManager.loadFilterByAttribute(RestockOrder.tableName,"state",  "ISSUED");
        
        if (!issueOrders) {
            return Promise.reject("404 No IssuedOrders Found")
        }

        let finalRes = [];
       // let eachOrderInfo = {};
        for (const order of issueOrders) {           
           let eachOrderInfo= await this.addOneOrderInfo(order);
           finalRes.push(eachOrderInfo)
        }    
        finalRes.skuItems =[];
        return  finalRes
    }

    async getRestockOrderByID(ID) {
        // let exists = await PersistentManager.exists(RestockOrder.tableName, 'id', ID);
        // if (!exists) {
        //     return Promise.reject("404 SKU");
        // }
        
        let ro = await PersistentManager.loadOneByAttribute("id", RestockOrder.tableName, ID);   
        if (!ro) {
            return Promise.reject("404 No RestockOrder Found")
        }
        let result = await this.addOneOrderInfo(ro) ;
        if(result.state!=="ISSUED") {
            result.deliveryDate=[];
            result.skuItems =[];
       }
        if(result.state!=="DELIVERY"){
            result.skuItems =[];
        }
        
        return result;
           
    }

    
    async getItemsById(ID) {  
        let allInfo = await this.getRestockOrderByID(ID);
        if((allInfo.state==="COMPLETE") ||(allInfo.state=== "RETURN")){
            return Promise.reject("422 restock order state is not COMPLETED or RETURN")
        }
        return allInfo.skuItems
    }

    //get all related info of ONE order
    async addOneOrderInfo(order){
        
        let curNoteid = order.transport_note_id;
        let curOrderid = order.id;    
        
        const exists = await PersistentManager.exists(RestockOrder.tableName, 'id', order.id);
        if (!exists) {
            return Promise.reject("404 RestockOrderid");
        }
        let productOrdersRows = await PersistentManager.loadFilterByAttribute(ProductOrder.tableName, "restockOrder_id", curOrderid);
        
        let promises = productOrdersRows.map(async o =>  {
            let skuinfo = await PersistentManager.loadOneByAttribute("id", Item.tableName, o.id);
            return {
                "SKUId":skuinfo.sku_id,
                "quantity": o.quantity,
                "description": skuinfo.description,
                "price": skuinfo.price
            }

        })
    //return only pending promise, need to await for each result
        let products = []
        for(const prom of promises){
            let item = await prom;
            products.push(item);
        }
        let curtransportNode = await PersistentManager.loadOneByAttribute("id", TransportNote.tableName, curNoteid);
        delete curtransportNode.id
        

        //get list of skuitem
        let skuItemsRow = await PersistentManager.loadFilterByAttribute(SKUItem.tableName, "restockOrder_id", curOrderid);
        //use map to sort only rfid + skuid and add to skuitem in res
        let skuItems = skuItemsRow.map(item => {
            return {
                "SKUId": item.SKUId,
                "RFID": item.RFID
            }
        })
        let res=
        {          
            "id":order.id,
            "issueDate":order.issue_date,
            "state":order.state,
            "products":products,
            "supplierId":order.supplier_id,
            "transportNote": curtransportNode ,
            "skuItems": skuItems 
        }    
        return res;      
    }


    async modifyState(roID, newState) {  
        
        const exists = await PersistentManager.exists(RestockOrder.tableName, 'id', roID);
        if (!exists) {
            return Promise.reject("404 RestockOrderid cannot found");
        }    
        return await PersistentManager.update(RestockOrder.tableName, {"state":newState}, 'id', roID);
    }

    async putSKUItems(id, newSkuitemsinfo) {
        
        let exists = PersistentManager.loadOneByAttribute('id',RestockOrder.tableName,  id);
        exists.then(
            result=>{
                if (result===undefined) {
                    return Promise.reject("404 RestockOrderid cannot found");
                }
                if(result.state!=="DELIVERED"){
                    return Promise.reject("422 The state of order is not DELIVERED")
                }
                //update restockorde_id in SKUItem table
                for(const info of newSkuitemsinfo ){       
                    PersistentManager.update(SKUItem.tableName, {"restockOrder_id":id}, 'RFID', info.RFID).then(
                        result=>{
                            return result;
                        },
                        error=>{
                            return Promise.reject(error);
                        }
                    )
                }              
            },
                error=>{
                    return Promise.reject(error)
                }
            
        )
        
       
       
    }


    async updateTransportNote(id, newTN) {
        const exists = await PersistentManager.exists(RestockOrder.tableName, 'id', id);
        if (!exists) {
            return Promise.reject("404 RestockOrderid cannot found");
        }

        let restockOrderRow = await PersistentManager.loadOneByAttribute("id",RestockOrder.tableName,id);
        let curTNId = restockOrderRow.transport_note_id;
        if(restockOrderRow.state!="DELIVERY "){
            return Promise.reject("422 Order State is not delievered")
        }
        else {
            return await PersistentManager.update(TransportNote.tableName, {"deliveryDate":newTN.deliveryDate}, 'id', curTNId);
        }
       
    }

    async deleteRestockOrder(roID) {
        // let loadedRestockOrder = await this.getRestockOrderByID(roID);
        // if (!loadedRestockOrder) {
        //     return Promise.reject("404 RestockOrderid cannot found")
        // }
        return PersistentManager.delete('id', roID, RestockOrder.tableName);
        
    }


}


module.exports = new RestockOrderManager();