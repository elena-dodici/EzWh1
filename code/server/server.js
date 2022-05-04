'use strict';
const express = require('express');
const position = require('./api/positionAPI');
// init express
const app = new express();
const port = 3001;


app.use(express.json());


//POST /api/position
app.post('/api/position', position.postPosition);

//GET /api/positions
app.get('/api/positions', position.getPositions);

/*
Activate the server
*/
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;