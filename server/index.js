// Imports
const express = require("express");
const mineflayer = require(`mineflayer`);
const { Collection } = require("discord.js")
const config = require(`./config.json`)
const datastoreRoute = require(`./routes/datastore.js`)
const userRoute = require(`./routes/users.js`)

// Initialization
const app = express();
const bot = mineflayer.createBot({
    host: `penjomo.aternos.me`,
    port: 25724,
    username: `Bazli Homok`,
    version: "1.20.2"
});

bot.on(`login`, () => {
    console.log(`Login`);
});

app.use(express.json());
app.use(express.urlencoded());

app.get(`/`, (req, res) => {
    res.send(`Hello World!`)
});

app.post(`/`, (req, res) => {
    res.status(201).send(req.body);
});

app.listen(5000, () => { console.log(`Listening on 5000`) });