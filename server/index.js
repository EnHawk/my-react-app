const express = require("express")
const app = express()
const config = require(`./config.json`)

app.get("/api", (req, res) => {
    res.json({ users: [ `foo`, `bar` ] })
})

app.listen(config.port, () => {
    console.log(`Listening On Port ${config.port}.`)
})