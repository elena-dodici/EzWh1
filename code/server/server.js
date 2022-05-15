'use strict';
const express = require('express');
const position = require('./api/positionAPI');
const sku = require('./api/skuAPI');
const skuItem = require('./api/skuItemAPI');
const testDescriptor = require('./api/testDescriptorAPI');
const testResult = require('./api/testResultAPI');
const PersistentManager = require('./bin/DB/PersistentManager');
const { checkSchema } = require('express-validator');
const internalOrders = require('./api/internalOrderAPI');
const restockOrders = require('./api/restockOrdersAPI');
const returnOrders = require('./api/returnOrdersAPI');
const item = require('./api/itemAPI');
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

//TEST DESCRIPTOR

//POST /api/testDescriptor
app.post('/api/testDescriptor',checkSchema(testDescriptor.postTestDescriptorSchema) ,testDescriptor.postTestDescriptor);

//GET /api/testDescriptors
app.get('/api/testDescriptors',  testDescriptor.getTestDescriptors);

//GET /api/testDescriptors/:id
app.get('/api/testDescriptors/:id',  testDescriptor.getTestDescriptorByID);

//PUT /api/testDescriptor/:id
app.put('/api/testDescriptor/:id', checkSchema(testDescriptor.modifyTestDescriptorByIdSchema),  testDescriptor.modifyTestDescriptorById);

//DELETE /api/testDescriptor/:id
app.delete('/api/testDescriptor/:id',  testDescriptor.deleteTestDescriptor);

//TEST RESULT

//POST /api/skuitems/testResult
app.post('/api/skuitems/testResult',checkSchema(testResult.postTestResultSchema), testResult.postTestResult);

//GET /api/skuitems/:rfid/testResults
app.get('/api/skuitems/:rfid/testResults',  testResult.getTestResults);

//GET /api/skuitems/:rfid/testResults/:id
app.get('/api/skuitems/:rfid/testResults/:id',  testResult.getTestResultByID);

//PUT /api/skuitems/:rfid/testResult/:id
app.put('/api/skuitems/:rfid/testResult/:id',checkSchema(testResult.modifyTestResultByIdSchema),  testResult.modifyTestResultById);

//DELETE /api/skuitems/:rfid/testResult/:id
app.delete('/api/skuitems/:rfid/testResult/:id',  testResult.deleteTestResult);
 


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

//GET /api/restockOrders/:id/returnItems
app.get('/api/restockOrders/:id/returnItems', restockOrders.getItemsById);

//PUT /api/restockOrder/:id 
app.put('/api/restockOrder/:id',restockOrders.updateState );

//PUT /api/restockOrder/:id/skuItems
app.put('/api/restockOrder/:id/skuItems',restockOrders.updateSKUItems );

//PUT /api/restockOrder/:id/transportNote  update and use transport id to update transport node(1 to 1)
app.put('/api/restockOrder/:id/transportNote', restockOrders.addTransportNode);

//GET api/restockOrders/:id/returnItems   
app.get('/api/restockOrders/:id',restockOrders.getRestockOrder);

//ReturnOrder
//GET /api/returnOrders  products list need to be finished
app.get('/api/returnOrders', returnOrders.getAllReturnOrders)

//GET /api/returnOrders/:id products list need to be finished
app.get('/api/returnOrders/:id', returnOrders.getAllReturnOrderById)

//POST /api/returnOrder  products list need to be finished
app.post('/api/returnOrder', returnOrders.postReturnOrder);

//DELETE /api/returnOrder/:id 
app.delete('/api/returnOrder/:id', returnOrders.deleteReturnOrder);

//ITEM

//POST /api/item
app.post('/api/item',checkSchema(item.postItemSchema), item.postItem);

//GET /api/items
app.get('/api/items',  item.getItems);

//GET /api/items/:id
app.get('/api/items/:id',  item.getItemByID);

//PUT /api/item/:id
app.put('/api/item/:id',checkSchema(item.modifyItemByIdSchema), item.modifyItemById);

//DELETE /api/items/:id
app.delete('/api/items/:id',  item.deleteItem);

/*
Activate the server
*/
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});





module.exports = app;