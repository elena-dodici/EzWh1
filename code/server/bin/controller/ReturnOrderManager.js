'use strict'
//import returnOrderObject
const ReturnOrder = require('../model/ReturnOrder');
const PersistentManager = require('../DB/PersistentManager');
const ProductOrder = require('../model/ProductOrder');
const SkuItem = require('../model/SKUItem')
const Sku = require('../model/SKU')


class ReturnOrderManager {
    constructor() { }

    async defineReturnOrder(date, productsList, roId) {

        const exists = await PersistentManager.exists(RestockOrder.tableName, 'id', roId);
        if (!exists) {
            return Promise.reject("404 not found restockOrderId");
        }

        let newReO = new ReturnOrder(null, date, null);
        let newReturnOID = await PersistentManager.store(ReturnOrder.tableName, newReO);
        //iterate in productlist of one order and insert this orderid in skuitem table as well

        for (let i = 0; i < productsList.length; i++) {
            let product = productsList[i];
            let curproRFID = product.RFID;
            PersistentManager.update(SkuItem.tableName, { returnOrder_id: newReturnOID }, "RFID", curproRFID);
        }
        return 0;
    }

    async listAllReturnOrders() {
        let ReturnOrders = await PersistentManager.loadAllRows(ReturnOrder.tableName);
        //get rdif and skuid from SKUitem table      
        let res = [];
        let productList = [];
        for (const curReturnOrder of ReturnOrders) {
            //return every product info           
            let product = await this.addProductsList(curReturnOrder);
            //combine into a array
            productList.push(product);
        }
        return res.push(productList);
    }

    async getReturnOrderByID(reoID) {
        let curReturnOrder = PersistentManager.loadOneByAttribute(id, ReturnOrder.tableName, reoID);
        //select rfid and skuid fromo skuitem table where resturnOrder id =reoid
        let product = await this.addProductsList(curReturnOrder);
        return product;
    }

    async addProductsList(curReturnOrder) {
        //select skuid from skuitem where resturnorderid=val
        //select description && price && rfid from SKU where skuid ...
        let curReturnOrderid = curReturnOrder.id;

        let skuItemList = await PersistentManager.loadFilterByAttribute(
            SkuItem.tableName,
            "returnOrder_id",
            curReturnOrderid,
        );

        for (const sku of skuItemList) {

            // sku.description = [];
            // sku.price = [];
            // let skuRow = await PersistentManager.loadFilterByAttribute(Sku.tableName,"id",sku.SKUId);

            PersistentManager.loadFilterByAttribute(Sku.tableName, "id", sku.SKUId).then(
                result => {
                    return {
                        "Skuid": sku.SKUId,
                        "description": result[0].description,
                        "price": result[0].price,
                        "RFID": sku.RFID
                    }
                },
                error => {
                    console.log(error);
                    return error;
                }
            );
        }

    }

    async deleteReturnOrder(reoID) {
        let loadedReturnOrder = await this.getReturnOrderByID(reoID);
        if (!loadedReturnOrder) {
            return Promise.reject("404 returnOrder not found")
        }
        return PersistentManager.delete('id', reoID, ReturnOrder.tableName);

    }




}



module.exports = new ReturnOrderManager();