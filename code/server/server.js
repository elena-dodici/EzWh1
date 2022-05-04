'use strict';
const express = require('express');
const position = require('./api/positionAPI');
// init express
const app = new express();
const port = 3001;


app.use(express.json());


//POST /api/position
app.post('/api/position', position.postPosition);

/*
//GET /api/test
app.get('/api/hello', (req,res)=>{
  let message = {
    message: 'Hello World!'
  }
  return res.status(200).json(message);
});


//POST /api/position
app.post('/api/position', (req,res) => {
  //validation to do
  if (Object.keys(req.body).length === 0) {
      return res.status(422).json({error: 'Empty body request'});
  }

  let positionID = req.body.positionID;
  let aisleID = req.body.aisleID;
  let row = req.body.row;
  let col = req.body.col;
  let maxWeight =  req.body.maxWeight;
  let maxVolume = req.body.maxVolume;

  PositionManager.definePosition(positionID, aisleID, row, col, maxWeight, maxVolume)

  return res.status(201).json({message: "ciao"});

})*/

/*
Activate the server
*/
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;