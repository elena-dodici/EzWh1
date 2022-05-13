'use strict';
const express = require('express');
const position = require('./api/positionAPI');
const sku = require('./api/skuAPI')
const skuItem = require('./api/skuItemAPI')
const PersistentManager = require('./bin/DB/PersistentManager');
const { checkSchema } = require('express-validator');
const internalOrders = require('./api/internalOrderAPI');
const restockOrders = require('./api/restockOrdersAPI');
const returnOrders = require('./api/returnOrdersAPI')
// init express
const app = new express();
const port = 3001;


app.use(express.json());

//POSITION

//POST /api/position
app.post('/api/position', checkSchema(position.postPositionSchema) ,position.postPosition);

//GET /api/positions
app.get('/api/positions', position.getPositions);

//PUT /api/positions/:positionID
app.put('/api/position/:positionID', checkSchema(position.updatePositionSchema), position.updatePosition);

//PUT /api/position/:positionID/changeID
app.put('/api/position/:positionID/changeID', checkSchema(position.changePositionIDSchema),position.changePositionID);

//DELETE /api/position/:positionID
app.delete('/api/position/:positionID', checkSchema(position.deletePositionSchema),position.deletePosition);

//SKU

//POST /api/sku
app.post('/api/sku', checkSchema(sku.postSchema), sku.postSKU);

//GET /api/skus
app.get('/api/skus', sku.getSKUS);

//GET /api/skus/:id
app.get('/api/skus/:id', sku.getSKUByID);

//PUT /api/sku/:id
app.put('/api/sku/:id', checkSchema(sku.modifySKUByIdSchema), sku.modifySKUById);

//PUT /api/sku/:id/position
app.put('/api/sku/:id/position', checkSchema(sku.putPositionToSkuSchema), sku.putPositionToSku)

//DELETE /api/skus/:id
app.delete('/api/skus/:id', sku.deleteSKU);

//SKUItem

//GET /api/skuitems
app.get('/api/skuitems', skuItem.getSKuItems);

//GET /api/skuitems/sku/:id
app.get('/api/skuitems/sku/:id', skuItem.getSkuItemsBySKU);

//GET /api/skutiems/:rfid
app.get('/api/skuitems/:rfid', skuItem.getSKUItemByRfid);

//POST /api/skuitem
app.post('/api/skuitem', checkSchema(skuItem.postSkuItemSchema) , skuItem.postSkuItem);

//PUT /api/skuitems/:rfid
app.put('/api/skuitems/:rfid', checkSchema(skuItem.putSkuItemSchema), skuItem.putSkuItem);

//DELETE /api/skuitems/:rfid
app.delete('/api/skuitems/:rfid', skuItem.deleteSkuItem);
 


//InternalOrder
//GET /api/InternalOrders  
app.get('/api/InternalOrders', internalOrders.getAllInternalOrder)

//GET /api/internalOrdersIssued 
app.get('/api/internalOrdersIssued', internalOrders.getInternalOrderIssued)

//GET /api/internalOrdersAccepted 
app.get('/api/internalOrdersAccepted', internalOrders.getinternalOrdersAccepted);

//GET /api/internalOrders/:id 
app.get('/api/internalOrders/:id', internalOrders.getinternalOrderById);

//POST /api/internalOrders  
app.post('/api/internalOrders', internalOrders.postInternalOrder);

//DELETE /api/internalOrdersIssued  
app.delete('/api/internalOrders/:id', internalOrders.deleteInternalOrder);

//PUT /api/internalOrders/:id   
app.put('/api/internalOrders/:id', internalOrders.changeInternalOrder);


//RestockOrder
//POST /api/restockOrder 
app.post('/api/restockOrder', restockOrders.postRestockOrder);

//DELETE /api/restockOrder/:id imitate internalorder
app.delete('/api/restockOrder/:id', restockOrders.deleteRestockOrder);

//GET /api/restockOrders 
app.get('/api/restockOrders', restockOrders.getRestockOrder);

//GET /api/restockOrdersIssued
app.get('/api/restockOrdersIssued', restockOrders.getRestockIssuedOrder);

//GET /api/restockOrders/:id
app.get('/api/restockOrders/:id', restockOrders.getRestockOrderById);

//PUT /api/restockOrder/:id just update state no new table needed
app.put('/api/restockOrder/:id',restockOrders.updateState );

//PUT /api/restockOrder/:id/skuItems update restock and sku-item as well a lot to do(relationship?)
app.put('/api/restockOrder/:id/skuItems', );

//PUT /api/restockOrder/:id/transportNote  update and use transport id to update transport node(1 to 1)
app.put('/api/restockOrder/:id/transportNote', );

//GET api/restockOrders/:id/returnItems   use restock_id to find rfid+sku_id and return that list
app.get('/api/restockOrders/:id',);

//ReturnOrder
//GET /api/returnOrders  products list need to be finished
app.get('/api/returnOrders', returnOrders.getAllReturnOrders)

//GET /api/returnOrders/:id products list need to be finished
app.get('/api/returnOrders/:id', returnOrders.getAllReturnOrderById)

//POST /api/returnOrder  products list need to be finished
app.post('/api/returnOrder', returnOrders.postReturnOrder);

//DELETE /api/returnOrder/:id 
app.delete('/api/returnOrder/:id', returnOrders.deleteReturnOrder);

/*
Activate the server
*/
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});





module.exports = app;