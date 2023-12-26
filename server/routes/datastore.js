// Imports
const express = require(`express`)
const { Collection } = require(`discord.js`)

// Initialization
const router = express.Router()
const dataStore = new Collection()

router.use(express.json())

// Main
router.get(`/`, (req, res) => {
    res.json(dataStore.toJSON())
})

// Exports
module.exports = router