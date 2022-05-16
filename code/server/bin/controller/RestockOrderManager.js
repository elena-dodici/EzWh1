const RestockOrder = require('../model/RestockOrder');
const PersistentManager = require('../DB/PersistentManager');
const TransportNote = require('../model/TransportNote')
const Item = require('../model/Item')
const ProductOrder = require('../model/ProductOrder')
const SKUItem = require('../model/SKUItem');
const res = require('express/lib/response');

class RestockOrderManager {
    constructor() { }

    async defineRestockOrder(issue_date, productsList, supplierId) {
        let ro = new RestockOrder(null, issue_date, "ISSUED", null, null);
        await PersistentManager.store(RestockOrder.tableName, ro);

        //get item_id from ITEM by using skuid & supplier_id
        for (const product of productsList) {
            let curProSkuid = product.SKUId;
            let curqty = product.qty;
            let itemId = await PersistentManager.loadByMoreAttributes(Item.tableName, ["sku_id", "supplier_id"], [curProSkuid, supplierId])
            //update the qty in ProductOrder table
            let originQty = await PersistentManager.loadOneByAttribute("id", ProductOrder.tableName, itemId)
            await PersistentManager.update(
                ProductOrder.tableName,
                { quantity: originQty + curqty },
                "id",
                itemId
            )
        }
        return

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
         console.log(finalRes);
         return finalRes;
     }


    async getAllIssuedOrder() {
        let issueOrders =await PersistentManager.loadFilterByAttribute(RestockOrder.tableName,"state",  "ISSUED");
        let finalRes = [];
       // let eachOrderInfo = {};
        for (const order of issueOrders) {           
           let eachOrderInfo= await this.addOneOrderInfo(order);
           finalRes.push(eachOrderInfo)
        }     
        return  finalRes
    }

    async getRestockOrderByID(ID) {
        
        let ro = await PersistentManager.loadOneByAttribute("id", RestockOrder.tableName, ID);   
        return await this.addOneOrderInfo(ro) 
           
    }

    
    async getItemsById(ID) {  
        let allInfo = await this.getRestockOrderByID(ID);
        return allInfo.skuItems
    }

    //get all related info of ONE order
    async addOneOrderInfo(order){
        let curNoteid = order.transport_note_id;
        let curOrderid = order.id;       
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
        return await PersistentManager.update(RestockOrder.tableName, {"state":newState}, 'id', roID);
    }

    async putSKUItems(id, newSkuitemsinfo) {
       //update testockorde_id in SKUItem table
       for(const info of newSkuitemsinfo ){       
           await PersistentManager.update(SKUItem.tableName, {"restockOrder_id":id}, 'RFID', info.RFID);
       }    
       return 
    }


    async updateTransportNote(id, newTN) {
        let restockOrderRow = await PersistentManager.loadOneByAttribute("id",RestockOrder.tableName,id);
        let curTNId = restockOrderRow.transport_note_id;
        console.log(curTNId)
        return await PersistentManager.update(TransportNote.tableName, {"deliveryDate":newTN.deliveryDate}, 'id', curTNId);
    }

    async deleteRestockOrder(roID) {
        let loadedRestockOrder = await this.getRestockOrderByID(roID);
        if (!loadedRestockOrder) {
            return Promise.reject("404 No restockOrder Found")
        }
        return PersistentManager.delete('id', delroID, RestockOrder.tableName);
    }


}


module.exports = new RestockOrderManager();