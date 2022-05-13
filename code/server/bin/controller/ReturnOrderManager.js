'use strict'
//import returnOrderObject
const ReturnOrder = require('../model/ReturnOrder');
const PersistentManager = require('../DB/PersistentManager');
const ProductOrder = require('../model/ProductOrder');

class ReturnOrderManager{
    constructor(){}

    async defineReturnOrder(date,productsList,roId){
        //try insert without primarykey let it increase automatically       
        let newReO = new ReturnOrder(null,date,null);
        let ReturnOrderT= await PersistentManager.store(ReturnOrder.tableName, newReO);
        
    }

    listAllReturnOrders(){
        
        let ReturnOrders = PersistentManager.loadAllRows(ReturnOrder.tableName);
        //get rdif and skuid from SKUitem table
        
        return ReturnOrders;
        
    }
    
    async getReturnOrderByID(reoID){
        let ReturnOrder = PersistentManager.loadOneByAttribute(id,ReturnOrder.tableName,reoID);
       //select rfid and skuid fromo skuitem table where resturnOrder id =reoid
        let productsList = await PersistentManager.loadFilterByAttribute(restockOrder_id,ProductOrder.tableName,reoID)
        
        return ReturnOrder;
    }

    async deleteReturnOrder(reoID){
        let loadedReturnOrder = await this.getReturnOrderByID(reoID);
        if(!loadedReturnOrder) {
            return Promise.reject("404 returnOrder not found")
        }
        return  PersistentManager.delete('id',reoID,ReturnOrder.tableName);
        
    }
//need 
    async addProductsList(result){
        let newRow=[];
        for(let i=0;i<result.length;i++ ){
            let currentRO =result[i];
            //define a new array for products
             currentRO.prodcts=[];
            let res = await this.loadProducts(currentRO.id);
            for(const i of res ){
                currentRO.prodcts.push(i)
            }
            newRow.push(currentRO);
        }
        return newRow;
    }

    loadProducts(RoId){

    }

    async deleteReturnOrder(roID){
        let loadedRestockOrder = await this.getReturnOrderByID(roID);
        if(!loadedRestockOrder) {
            return Promise.reject("404 No restockOrder Found")
        }
        return PersistentManager.delete('id',delroID,ReturnOrder.tableName);
    }

}



module.exports = new ReturnOrderManager();