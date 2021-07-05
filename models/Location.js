const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const locationSchema = new Schema({
    name: { type: String },
    address: { type: String },
    imageUrl: { type: String },
    owner: { 
        type: Schema.Types.ObjectId,
        ref: "User"
    },
 //   reviews: [] // we will update this field a bit later when we create review model
  });

  const Location = mongoose.model('Location', locationSchema);

module.exports = Location;