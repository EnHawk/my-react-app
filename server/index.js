// Imports
const express = require("express")
const { Collection } = require("discord.js")
const config = require(`./config.json`)
const datastoreRoute = require(`./routes/datastore.js`)
const userRoute = require(`./routes/users.js`)

// Initialization
const app = express()
const DataStore = new Collection()

// Main
app.use(`/datastore`, datastoreRoute)
app.use(`/users`, userRoute)

app.listen(config.port, () => {
    console.log(`Listening On Port ${config.port}.`)
})