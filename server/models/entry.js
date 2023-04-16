const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema(
  {
    entryTitle: {
      type: String,
      require: [true, 'please provide an entry title'],
    },
    entryLocation: {
      type: String,
      require: [true, 'Please provide an entry location'],
      //   minLength: 38,
      // maxLength: 12,
    },
    entryBody: {
      type: String,
      require: [true, 'Please provide the entry body'],
      //   minLength: 38,
      // maxLength: 12,
    },
    entryIndex: {
      type: Number,
      require: [
        true,
        'correct entry index is absent - there seem to be a client-side programming error',
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('entry', entrySchema);
