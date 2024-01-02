// Imports
const express = require(`express`)
const { Collection } = require(`discord.js`)
const { encrypt, decrypt } = require(`../utils/cipher.js`)
const { admin_authorization } = require(`../config.json`)

// Initialization
const router = express.Router()
const Users = new Collection()

router.use(express.json())

// Operations
function generateId() {
    const length = 9
    let id = ``

    for (i = 0; i <= length; i++) {
        id += Math.round(Math.random() * length)
    }

    return parseInt(id)
}

function generateKey() {
    const maxLength = 32
    const chars = `abcdefghijklmnopqrstuvwxyz`
    let key = ``

    for (i = 0; i < maxLength; i++) {
        const char = chars.charAt(Math.round(Math.random() * chars.length))
        const choices = [ char.toUpperCase(), char.toLowerCase(), Math.ceil(Math.random() * 9)]
        key += choices[Math.round(Math.random() * (choices.length - 1))]
    }

    return key
}

// Main
router.get(`/`, (req, res) => {
    function getUsers() {
        const users = Users.toJSON()

        res.status(201).json(users)
        return users
    }

    if (!req.headers[`x-api-key`]) {
        res.status(401).json({ error: `Authorization required.` })
        return;
    }

    if (req.headers[`x-api-key`] !== `1234567890`) {
        res.status(401).json({ error: `Authorization incorrect.` })
        return;
    }

    getUsers()
})

router.get(`/:id`, (req, res) => {
    function getUser(user_id, password) {
        const collectionName = `User.${user_id}`

        /**
         * Make sure if the User is in the Users' Data Collection.
         */
        if (!Users.has(collectionName)) {
            res.status(401).json({ error: `Couldn't find user.` })
            return;
        }

        const user = Users.get(collectionName)

        /**
         * Make sure if the provided password matches with the User's stored password.
         */
        if (password !== decrypt(user.password, user.username)) {
            res.status(401).json({ error: `Password Incorrect.` })
            return;
        }

        res.status(201).json(user)
        return user
    }

    const userId = req.params.id

    if (!req.headers.password) {
        res.status(401).json({ error: `Password required.` })
        return;
    }

    const password = req.headers.password

    getUser(userId, password)
})

router.post(`/`, (req, res) => {
    function createUser(profile, status, auth) {
        const { username, avatar } = profile
        const { password } = auth

        if (Users.find(u => u.username === username)) {
            res.status(400).json({ error: `Username already used.` })
            return;
        }

        const user_id = generateId()
        const collectionName = `User.${user_id}`
        const authorization = {}

        if (status === `Admin`) {
            authorization.api_key = encrypt(generateKey(), `api`)
        }

        const data = {
            profile: {
                username,
                avatar_url,
                created_at: Date.now()
            },
            status,
            authentication: {
                username: encrypt(username, username),
                password: encrypt(password, username)
            },
            authorization
        }

        Users.set(collectionName, data)

        const user = Users.get(collectionName)

        res.status(201).json(user)
        return user;
    }

    if (!req.headers[`x-api-key`]) {
        res.status(401).json({ error: `Authorization Required.` })
        return;
    }

    const apiKey = req.headers[`x-api-key`]

    if (apiKey !== `1234567890`) {
        res.status(403).json({ error: `Invalid API Key.` })
        return;
    }

    if (!req.body.profile.username) {
        res.status(400).json({ error: `Username required.` })
        return;
    }

    const username = req.body.username

    if (!req.body.profile.avatar) {

    }

    if (!req.body.auth.password) {
        res.status(400).json({ error: `User's password required.` })
        return;
    }

    

    const password = req.body.password

    if (!req.body.status) {
        res.status(400).json({ error: `User's status required.` })
        return;
    }

    const status = req.body.status

    createUser(
        {
            username,
            avatar
        },
        status,
        {
            password
        }

    )
})

// Exports
module.exports = router