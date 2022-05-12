'use strict';
const express = require('express');
const position = require('./api/positionAPI');
const sku = require('./api/skuAPI')
const skuItem = require('./api/skuItemAPI')
const PersistentManager = require('./bin/DB/PersistentManager');
const { checkSchema } = require('express-validator');
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
 

/*
Activate the server
*/
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});





module.exports = app;