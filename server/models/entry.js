const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema(
  {
    entryTitle: {
      type: String,
      required: [true, 'please provide an entry title'],
    },
    entryLocation: {
      type: String,
      required: [true, 'Please provide an entry location'],
      //   minLength: 38,
      // maxLength: 12,
    },
    entryBody: {
      type: String,
      required: [true, 'Please provide the entry body'],
      //   minLength: 38,
      // maxLength: 12,
    },
    entryIndex: {
      type: Number,
      // required: [
      //   true,
      //   'correct entry index is absent - there seem to be a client-side programming error',
      // ],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
      // required: [true, 'User not provided'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('entry', entrySchema);
