//need object
const PersistentManager = require('../DB/PersistentManager');
const InternalOrder = require('../model/InternalOrder')
const InternalOrderProduct = require('../model/InternalOrderProduct')
const SKUItem = require('../model/SKUItem')
const SKU = require('../model/SKU')


class InternalOrderManager{
    constructor(){}

   async defineInternalOrder(date,productlist,customerId){
        //issued once created
        //save io , get ioid and take this with product in IOproduct table 
        let newIo = new InternalOrder(null,date,'ISSUED',null);
        let newIOid = await PersistentManager.store(InternalOrder.tableName, newIo);
        for(let i=0;i<productlist.length;i++){
            let product = productlist[i];
            let des = product.description;
            let pri = product.price;
            let qty = product.qty;
            let sku_id=product.SKUId;
            let newProduct = new InternalOrderProduct(null,des,pri,qty,sku_id,newIOid);
            PersistentManager.store(InternalOrderProduct.tableName, newProduct);
        }
         return
    }


    async modifyState(rowID, newState,ProductList){
        
        const exists = await PersistentManager.exists(InternalOrder.tableName, 'id', rowID);
        if (!exists) {
            return Promise.reject("404 not found InternalOrder");
        }
        
        if(ProductList!=undefined&&newState==="COMPLETED"){ 
            for(let product of ProductList){
                let curProRFID=product.RFID;
                let curSkuID =product.SkuID;
                await PersistentManager.update(SKUItem.tableName,{"Available":0},"RFID",curProRFID)
                
                    
                   //no sku find     
                let curSKU = await  PersistentManager.loadOneByAttribute("id",SKU.tableName,curSkuID)
                curSKU.then(
                    async result=>{
                        let curSKUqty = curSKU.availableQuantity;               
                        if (curSKUqty===1) {
                            await PersistsentManager.delete('id',curSkuID,SKU.tableName)
                        }
                        else{                          
                            let resultqty = curSKUqty-1;                     
                            await PersistentManager.update(SKU.tableName, {"availableQuantity":resultqty},"id",curSkuID );                                        
                            }
                    },
                    error=>{
                        return Promise.reject("noSKUfind")
                    }
                )
                

                 
                
                
            }
        }   
        return PersistentManager.update(InternalOrder.tableName,{"state":newState},"id",rowID)
    }



    //need products list
    async listAllInternalOrder(){
        let originIo =  await PersistentManager.loadAllRows(InternalOrder.tableName);
        let result = await this.addProductsList(originIo);
        return result;
      
    }

    async   listIssuedIO(){
        let originIo = await PersistentManager.loadFilterByAttribute(InternalOrder.tableName,'state','ISSUED');
        let result = await this.addProductsList(originIo);
        
        return result;
    }

    async listAcceptedIO(){
        let result = await PersistentManager.loadFilterByAttribute(InternalOrder.tableName,'state','ACCEPTED');    
        //add the array to each line of result
        return this.addProductsList(result);
        
    }

    async listIOByID(id){
        //only have one line so cannot read
        let result = await PersistentManager.loadOneByAttribute("id",InternalOrder.tableName,id);         
        return this.addProductsList(result);

    }


    async addProductsList(result){     
        let newRow =[];
        if (Array.isArray(result)){
              //add the array to each line of result
            for (let i =0;i<result.length;i++){
                let newIOrder = result[i];
                newIOrder.products =[];
                //give io products id             
                let res = await this.loadProducts(newIOrder.id);               
                newIOrder.products.push(res);      
                newRow.push(newIOrder);
            }    
        }
        else{
            result.products =[];            
            let res = await this.loadProducts(result.id);              
            result.products.push(res);      
            newRow.push(result);      
        }  
        return newRow;

    }

    async deleteIO(roId){
        let Io = await this.listIOByID(roId);
        //check validation
        if(!Io){
            return Promise.reject("InternalOrder not exists")
        }
        // delete info in products table
        if (Io.products){
            try{
                await PersistentManager.delete(internalOrder_id,roId,InternalOrderProduct.tableName)
            }
            catch{
                return Promise.reject("generic error")
            }
        }

        PersistentManager.delete('id',roId,InternalOrder.tableName)
    }

    async loadProducts(IOId){
        let products ;
        await PersistentManager.loadFilterByAttribute(InternalOrderProduct.tableName,'internalOrder_id',IOId). then(
            result =>{
                products = result;
            },
            error =>{
                console.log(error);
            }
        );
        
        return products
    }

}

module.exports=new InternalOrderManager();