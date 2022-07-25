const mongoose = require("mongoose");

const SourBeerSchema = mongoose.Schema(
  {
    name: String,
    brewery: String,
    abv: Number,
    volume: Number,
    price: Number,
    launchdate: Date,
    permanentOutOfStock: Boolean,
    temporaryOutOfStock: Boolean,
    completed: { type: Boolean, default: false }
  },
  {
    collection: "sourbeers"
  }
);

module.exports = mongoose.model("sourbeers", SourBeerSchema);
