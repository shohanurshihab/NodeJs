const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('./dbconfig');


sql.connect(config, function (err) {
  if (err) {
    console.log('Error connecting to SQL Server:', err);
  } else {
    console.log('Connected to SQL Server.');
  }
});

router.get('/users', (req, res) => {
  const request = new sql.Request();
  request.query('SELECT * FROM users', (err, result) => {
    if (err) {
      console.log('Error retrieving data:', err);
      res.status(500).send('Error retrieving data from database.');
    } else {
      console.log('Data retrieved successfully:', result);
      res.json(result.recordset);
    }
  });
});


const data = [
  {
    id: 1,
    name: 'John Doe',
    age: 30,
  },
  {
    id: 2,
    name: 'Jane Doe',
    age: 25,
  },
  {
    id: 3,
    name: 'Bob Smith',
    age: 45,
  },
];

router.get('/data', (req, res) => {
  res.send(data);
});

router.get('/data/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = data.find(item => item.id === id);
  if (!item) {
    res.status(404).send(`Data with ID ${id} not found`);
  } else {
    res.json(item);
  }
});

router.post('/data', (req, res) => {
  const newData = req.body;
  newData.id = data.length + 1;
  data.push(newData);
  res.status(201).send(newData);
});

// PUT update data
router.put('/data/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = data.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    res.status(404).send(`Data with ID ${id} not found`);
  } else {
    const updatedData = req.body;
    updatedData.id = id;
    data[itemIndex] = updatedData;
    res.json(updatedData);
  }
});

router.delete('/data/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = data.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    res.status(404).send(`Data with ID ${id} not found`);
  } else {
    data.splice(itemIndex, 1);
    res.status(204).send();
  }
});


router.post('/users', (req, res) => {
  const newData = req.body;
  //newData.id = data.length + 1;
  
  const request = new sql.Request();
  //request.input('id', sql.Int, newData.id);
  request.input('name', sql.NVarChar, newData.name);
  request.input('age', sql.Int, newData.age);
  
  request.query('INSERT INTO users (name, age) VALUES ( @name, @age)', (err, result) => {
    if (err) {
      console.log('Error inserting data:', err);
      res.status(500).send('Error inserting data into database.');
    } else {
      console.log('Data inserted successfully:', result);
      res.status(201).send(newData);
    }
  });
});

router.delete('/users/:id', (req, res) => {
  const id = req.params.id;

  const request = new sql.Request();
  request.input('id', sql.Int, id);

  request.query('DELETE FROM users WHERE id = @id', (err, result) => {
    if (err) {
      console.log('Error deleting data:', err);
      res.status(500).send('Error deleting data from database.');
    } else if (result.rowsAffected[0] === 0) {
      res.status(404).send('User not found.');
    } else {
      console.log('Data deleted successfully:', result);
      res.sendStatus(204);
    }
  });
});

router.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;
  
  const request = new sql.Request();
  request.input('name', sql.NVarChar, updatedData.name);
  request.input('age', sql.Int, updatedData.age);
  request.input('id', sql.Int, userId);
  
  request.query('UPDATE users SET name = @name, age = @age WHERE id = @id', (err, result) => {
    if (err) {
      console.log('Error updating data:', err);
      res.status(500).send('Error updating data in database.');
    } else if (result.rowsAffected == 0) {
      res.status(404).send('User not found.');
    } else {
      console.log('Data updated successfully:', result);
      res.status(200).send('Data updated successfully.');
     // res.json(result.recordset);
    }
  });
});



module.exports = router;
