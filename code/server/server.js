'use strict';
const express = require('express');
const position = require('./api/positionAPI');
const sku = require('./api/skuAPI')
const PersistentManager = require('./bin/DB/PersistentManager');
// init express
const app = new express();
const port = 3001;


app.use(express.json());


//POST /api/position
app.post('/api/position', position.postPosition);

//GET /api/positions
app.get('/api/positions', position.getPositions);

//PUT /api/positions/:positionID
app.put('/api/position/:positionID', position.updatePosition);

//PUT /api/position/:positionID/changeID
app.put('/api/position/:positionID/changeID', position.changePositionID);

//DELETE /api/position/:positionID
app.delete('/api/position/:positionID', position.deletePosition);

//POST /api/sku
app.post('/api/sku', sku.postSKU);

//GET /api/skus
app.get('/api/skus', sku.getSKUS);

//GET /api/skus/:id
app.get('/api/skus/:id', sku.getSKUByID);

//PUT /api/sku/:id
app.put('/api/sku/:id', sku.modifySKUById);

//PUT /api/sku/:id/position
app.put('/api/sku/:id/position', sku.putPositionToSku)

//DELETE /api/skus/:id
app.delete('/api/skus/:id', sku.deleteSKU);

/*
Activate the server
*/
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});





module.exports = app;