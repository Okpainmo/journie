const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'please provide your username'],
    },
    password: {
      type: String,
      require: [true, 'Please provide your password'],
      //   minLength: 38,
      // maxLength: 12,
    },
    confirmPassword: {
      type: String,
      //   require: [true, 'Please provide your password'],
      //   minLength: 38,
      // maxLength: 12,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('user', userSchema);
