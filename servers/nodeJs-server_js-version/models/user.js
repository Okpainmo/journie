const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'please provide your full name'],
    },
    email: {
      type: String,
      required: [true, 'please provide your email address'],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        ,
        'Please provide a valid email address',
      ],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide your password'],
      minLength: 6,
      // maxLength: 12,
    },
    confirmPassword: {
      type: String,
      required: [true, 'Please provide your password'],
      minLength: 6,
      // maxLength: 12,
    },
    profileImageUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('user', userSchema);
