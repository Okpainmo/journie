// dotenv import
require('dotenv').config();

// jwt import
const jwt = require('jsonwebtoken');

//bcryptjs import
const bcrypt = require('bcryptjs');

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
    // check if all fields are filled

    if (!fullName || !email || !password || !confirmPassword) {
      res.status(401).json({
        requestStatus: 'account creation failed: please fill in all fields',
      });
    }

    // hashing passwors for security

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);

    const hashedConfirmPassword = await bcrypt.hash(confirmPassword, salt);
    console.log(hashedConfirmPassword);

    // create user with hashed password

    const user = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
      confirmPassword: hashedConfirmPassword,
    });

    // console.log(user);

    // create token

    const token = jwt.sign(
      { userId: user._id, userEmail: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_LIFETIME }
    );

    // return response

    res.status(201).json({
      requestStatus: 'account created successfully',
      user: user,
      token: token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ requestStatus: 'account creation failed', errorMessage: error });
    // console.log(error);
  }
});

// log-in user

app.post('/api/log-in', async (req, res) => {
  const { email, password } = req.body;

  try {
    // check if email and password are provided

    if (!email || !password) {
      res.status(401).json({
        requestStatus: 'login unsuccessful: email or password not provided',
        errorMessage: error,
      });
    }

    // find user by email and password

    const user = await userModel.findOne({ email: email });

    // return error if user is not valid

    if (!user) {
      res.status(404).json({
        requestStatus: 'login unsuccessful: user not found',
        errorMessage: error,
      });
    }

    // compare hashed password with password in db

    const isMatch = await bcrypt.compare(password, user.password);
    // console.log(isMatch);

    if (!isMatch) {
      res.status(401).json({
        requestStatus: 'login unsuccessful: password does not match',
        errorMessage: error,
      });
    }

    // create token

    const token = jwt.sign(
      { userId: user._id, userEmail: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_LIFETIME }
    );
    // console.log(token);

    // authorize user

    const authHeader = req.headers.authorization;
    // console.log(authHeader);

    const returnedToken = authHeader.split(' ')[1];
    // console.log(returnedToken);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        requestStatus: 'login unsuccessful: authentication rejected',
        errorMessage: error,
      });
    }

    const isAuthorized = jwt.verify(returnedToken, process.env.JWT_SECRET);

    if (
      !isAuthorized ||
      isAuthorized.userId !== user._id ||
      isAuthorized.email !== user.email
    ) {
      res.status(401).json({
        requestStatus: 'login unsuccessful: authentication rejected',
        errorMessage: error,
      });
    }

    res
      .status(200)
      .json({ requestStatus: 'login successful', user: user, token: token });
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
