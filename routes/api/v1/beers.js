const express = require("express");
const router = express.Router();
const { refreshHandler, signinHandler, welcomeHandler } = require('../../../sessionhandlers')

var BeerList = require("../../../models/Beers");
var SourBeerList = require("../../../models/SourBeers")

router.get("/ipa", async (req, res) => {
  try {
    const beerList = await BeerList.find();
    if (beerList.length === 0)
      return res.status(404).json({ message: "list is empty" });
    res.status(200).json(beerList);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
});

router.patch("/ipa/tried/:id", refreshHandler, async (req, res) => {
  const id = req.params.id;
  try {
    const beer = await BeerList.findOne({ _id: id });
    beer.completed = !beer.completed;
    const savedBeer = await beer.save();
    return res.status(200).json(savedBeer);
  } catch (error) {
    return res.status(400).json(error.message);
  }
});

router.get("/sour", async (req, res) => {
  try {
    const sourBeerList = await SourBeerList.find();
    if (sourBeerList.length === 0)
      return res.status(404).json({ message: "list is empty" });
    res.status(200).json(sourBeerList);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
});


router.patch("/sour/tried/:id", refreshHandler, async (req, res) => {
  const id = req.params.id;
  try {
    const beer = await SourBeerList.findOne({ _id: id });
    beer.completed = !beer.completed;
    const savedBeer = await beer.save();
    return res.status(200).json(savedBeer);
  } catch (error) {
    return res.status(400).json(error.message);
  }
});

module.exports = router;
