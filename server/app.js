// dotenv import
require('dotenv').config();

// cors(cross origin resource sharing)
const cors = require('cors');

// express init
const express = require('express');
const app = express();

// connect DB
const dbConnector = require('./db/connect-db');

// express middleware for handling json data in post-requests
app.use(express.json());

// use cors
app.use(cors());

// models

const userModel = require('./models/user');
const entryModel = require('./models/entry');

// home-route
app.get('/api', (req, res) => {
  res.status(200).send('app is live - welcome to journie');
});

// create user
app.post('/api/sign-up', async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;

  try {
    const user = await userModel.create({
      fullName,
      email,
      password,
      confirmPassword,
    });
    res
      .status(201)
      .json({ requestStatus: 'account created successfully', user: user });
  } catch (error) {
    res
      .status(500)
      .json({ requestStatus: 'account creation failed', errorMessage: error });
    // console.log(error);
  }
});

// log in user

app.post('/api/log-in', async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  try {
    // find user by email and password

    if (!email || !password) {
      res.status(500).json({
        requestStatus: 'login unsuccessful: email or password not provided',
        errorMessage: error,
      });
    }

    const user = await userModel.findOne({ email: email, password: password });

    if (!user) {
      res.status(404).json({
        requestStatus: 'login unsuccessful: user not found',
        errorMessage: error,
      });
    }

    res.status(200).json({ requestStatus: 'login successful', user: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      requestStatus: 'login unsuccessful: user not returned',
      errorMessage: error,
    });
  }
});

//get single user

app.get('/api/get-user/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userModel.findOne({ _id: id });
    res
      .status(200)
      .json({ requestStatus: 'user fetched successfully', user: user });
  } catch (error) {
    res
      .status(500)
      .json({ requestStatus: 'request unsuccessful', errorMessage: error });
    console.log(error);
  }
});

// get all users
app.get('/api/get-all-users', async (req, res) => {
  try {
    const allUsers = await userModel.find({});
    res.status(200).json({
      requestStatus: 'users fetched successfully',
      count: allUsers.length,
      users: allUsers,
    });
  } catch (error) {
    res
      .status(500)
      .json({ requestStatus: 'request unsuccessful', errorMessage: error });
    console.log(error);
  }
});

// create entry;
app.post('/api/create-entry', async (req, res) => {
  const { entryTitle, entryLocation, entryBody, entryIndex } = req.body;

  try {
    const entry = await entryModel.create({
      entryTitle,
      entryLocation,
      entryBody,
      entryIndex,
    });
    res
      .status(201)
      .json({ requestStatus: 'entry created successfully', entry });
  } catch (error) {
    res.status(500).json({ errorMessage: error });
    console.log(error);
  }
});

//get single entry

app.get('/api/get-entry/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const entry = await entryModel.findOne({ _id: id });
    res
      .status(200)
      .json({ requestStatus: 'entry fetched successfully', entry: entry });
  } catch (error) {
    res.status(500).json({ errorMessage: error });
  }
});

// get all entries

app.get('/api/get-all-entries', async (req, res) => {
  try {
    const allEntries = await entryModel.find({});
    res.status(200).json({
      requestStatus: 'entries fetched successfully',
      count: allEntries.length,
      entries: allEntries,
    });
  } catch (error) {
    res.status(500).json({ errorMessage: error });
    console.log(error);
  }
});

// delete entry

app.delete('/api/delete-entry/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const entry = await entryModel.findByIdAndRemove({ _id: id });

    if (!entry) {
      return res.status(404).json({ error: `entry with id: ${id} not found` });
    }

    res
      .status(200)
      .json({ requestStatus: 'entry deleted successfully', entry });
  } catch (error) {
    res.status(500).json({ errorMessage: error });
    console.log(error);
  }
});

// edit entry

app.patch('/api/edit-entry/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id);

  console.log(req.body);

  const { entryTitle, entryLocation, entryBody, entryIndex } = req.body;

  try {
    const entry = await entryModel.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });

    if (
      (entryTitle === '' || entryLocation === '' || entryBody === '',
      entryIndex === '')
    ) {
      return res.status(400).json({ error: `please fill all fields` });
    }

    if (!entry) {
      return res.status(404).json({ error: `entry with id: ${id} not found` });
    }

    res
      .status(200)
      .json({ requestStatus: 'entry updated successfully', entry: entry });
  } catch (error) {
    res.status(500).json({ errorMessage: error });
    console.log(error);
  }
});

// serve
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await dbConnector(process.env.MONGO_DB_CONNECTION_STRING);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
