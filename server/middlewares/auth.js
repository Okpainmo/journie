const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const authMiddleware = async (req, res, next) => {
  const userEmail = req.headers.email;
  // console.log(userEmail);

  // authenticate user
  const user = await userModel.findOne({ email: userEmail });
  // console.log(user);

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
  // console.log(isAuthorized);

  // console.log(isAuthorized.userId);
  // console.log(user._id);

  if (!isAuthorized || isAuthorized.userEmail !== user.email) {
    res.status(401).json({
      requestStatus: 'login unsuccessful: authentication rejected',
      errorMessage: error,
    });
  }

  req.user = {
    userId: isAuthorized.userId,
    userEmail: isAuthorized.userEmail,
  };

  console.log(req.user);
  // console.log(user);

  next();
};

module.exports = authMiddleware;
