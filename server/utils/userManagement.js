// Imports
const { Collection } = require(`discord.js`)
const { encrypt, decrypt } = require(`./cipher.js`)

// Initialization
const Users = new Collection()
let collectionName;
let user;

// Operations
function generateId() {
    const maxLength = 10
    let id = ``

    for (i = 0; i < maxLength; i++) {
        id += Math.round(Math.random() * maxLength)
    }

    return parseInt(id)
}

function generateKey() {
    const maxLength = 32
    const chars = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`
    let key = ``

    for (i = 0; i < maxLength; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return key
}

function createUser({ username, password, status }) {
    if (Users.find(u => u.username === username)) {
        return { error: `A user with the username provided already exist.` }
    }

    const user_id = generateId()
    collectionName = `User.${user_id}`
    const authorization = { password: encrypt(password, username) }

    if (status === `Admin`) {
        authorization.api_key = encrypt(generateKey(), `api`)
        authorization.bearer_token = encrypt(generateKey(), `bearer`)
    }

    Users.set(collectionName, { username, user_id, password, status, authorization })

    user = Users.get(collectionName)

    return user
}

function getUser(user_id, password) {
    collectionName = `User.${user_id}`

    /**
     * Make sure if the User is in the Users' Data Collection.
     */
    if (!Users.get(collectionName)) {
        return { error: `User Not Found.` }
    }

    user = Users.get(collectionName)

    /**
     * Make sure if the provided password matches with the User's stored password.
     */
    if (password !== decrypt(user.authorization.password, user.username)) {
        return { error: `Incorrect Password.` }
    }

    return user
}

function updateUser(user_id, password, data) {
    collectionName = `User.${user_id}`
    user = getUser(user_id, password)

    if (`error` in user) {
        return { error: User.error }
    }

    if (`password` in data) {
        user.authorization.password = data.password
    }

    if (`username` in data) {
        user.username = data.username
    }

    Users.set(collectionName, User)

    const updatedUser = Users.get(collectionName)

    return updatedUser
}

// Exports
module.exports = { createUser, getUser, updateUser, Users }