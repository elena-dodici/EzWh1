const RestockOrder = require('../model/Position');
const PersistentManager = require('../DB/PersistentManager');
const TransportNote = require('../model/TransportNote')
const Item = require('../model/Item')
const ProductOrder = require('../model/ProductOrder')

class RestockOrderManager {
    constructor() {}

    async defineRestockOrder(issue_date, productsList,supplierId) {            
        let ro = new RestockOrder(null, issue_date, "ISSUED", null, null);
        let RestockOId = await PersistentManager.store(RestockOrder.tableName, ro);
        //update the roid in  sku table 
        // let product=[];
        // for(let i =0;i<productsList.length;i++){
        //     product= productsList[i];
        //     let ProductO = new ProductOrder(null,product.qty,null,null);
        //     await PersistentManager.store(ProductOrder.tableName,ProductO)
        // }
        //let skurow = PersistentManager.update(SKUItem.tableName,xx,'restockOrder_id',roID)
        return 

    }

    getAllRestockOrder(){
        //!!!!!!also need to insert productslist from product && transport nodefrom transportnode(id) && skuitemslist(restockorderid in skuitem)
        let restockOrder = PersistentManager.loadAllRows(RestockOrder.tableName);
        return restockOrder;
    }


    getAllIssuedOrder(){
        let issueOrder = PersistentManager.loadOneByAttribute(state,RestockOrder.tableName,"ISSUED");
        //!!!!!!also need to insert productslist from product && transport nodefrom transportnode(id) && skuitemslist(restockorderid in skuitem)
        return issueOrder;
    }

    getRestockOrderByID(ID){
        let ro = PersistentManager.loadOneByAttribute(roID,RestockOrder.tableName,ID);
        return ro;

    }
    // getReturnItems(){loadOneByAttribute}
    modifyState( roID, newState){
        let ro = new RestockOrder(roID,issue_date,newState,0,0);
        return PersistentManager.update(RestockOrder.tableName,ro ,'state',roID);
    }

    addSKUItems(skuItems,newSkuItem){
    //??????????????how to update the list, into which attri in restock order     
       
    }


    addTransportNode(update){

    }

    async deleteRestockOrder(roID){
        let loadedRestockOrder = await this.getRestockOrderByID(roID);
        if(!loadedRestockOrder) {
            return Promise.reject("404 No restockOrder Found")
        }
        return PersistentManager.delete('id',delroID,RestockOrder.tableName);
    }


}


module.exports = new RestockOrderManager();