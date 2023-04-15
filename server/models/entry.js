const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema(
  {
    entryTitle: {
      type: String,
      required: [true, 'please provide entry title'],
    },
    entryLocation: {
      type: String,
      require: [true, 'Please provide entry location'],
      //   minLength: 38,
      // maxLength: 12,
    },
    entryBody: {
      type: String,
      require: [true, 'Please provide the entry body'],
      //   minLength: 38,
      // maxLength: 12,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('entry', entrySchema);
