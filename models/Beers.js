const mongoose = require("mongoose");

const BeerSchema = mongoose.Schema(
  {
    name: String,
    brewery: String,
    rating: Number,
    abv: Number,
    price: Number,
    completed: { type: Boolean, default: false },
  },
  {
    collection: "systembolaget",
  }
);

module.exports = mongoose.model("systembolaget", BeerSchema);
