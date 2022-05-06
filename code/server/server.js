'use strict';
const express = require('express');
const position = require('./api/positionAPI');
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

app.post('api/managerSessions', (req,res) => {
  m = {
    id: 1,
    username: "manager1@ezwh.com",
    password: "testpassword"
  }
  return res.status(200).json(m);
})
/*
Activate the server
*/
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});





module.exports = app;