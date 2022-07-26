const cookieParser = require('cookie-parser')
const uuid = require('uuid')

cookieParser.signedCookie("")

const users = {
    "user1": "password1",
    "user2": "password2"
}

class Session {
    constructor(username, expiresAt) {
        this.username = username
        this.expiresAt = expiresAt
    }

    isExpired() {
        this.expiresAt < (new Date())
    }
}

const sessions = {}

const signinHandler = (req, res) => {
    const { username, password } = req.body
    if (!username) return res.status(401).json({message: "unauthorized"})

    const expectedPassword = users[username]
    if (!expectedPassword || expectedPassword !== password) return res.status(401).json({message: "unauthorized"})

    const sessionToken = uuid.v4()

    const now = new Date()
    const expiresAt = new Date(+now + 120 * 1000)

    const session = new Session(username, expiresAt)
    sessions[sessionToken] = session

    res.cookie("session_token", sessionToken, { expires: expiresAt, signed: true })
    res.end()
}

const welcomeHandler = (req, res, next) => {
    if (!req.signedCookies) return res.status(401).json({message: "unauthorized"})

    const sessionToken = req.signedCookies['session_token']
    if (!sessionToken) return res.status(401).json({message: "unauthorized"})

    userSession = sessions[sessionToken]
    if (!userSession) return res.status(401).json({message: "unauthorized"})

    if (userSession.isExpired()) {
        delete sessions[sessionToken]
        return res.status.json({message: "unauthorized"})
    }
    next()
}

const refreshHandler = (req, res, next) => {
    // (BEGIN) The code from this point is the same as the first part of the welcomeHandler
    if (!req.signedCookies) return res.status(401).json({message: "unauthorized"})

    const sessionToken = req.signedCookies['session_token']
    if (!sessionToken) return res.status(401).json({message: "unauthorized"})

    userSession = sessions[sessionToken]
    if (!userSession) return res.status(401).json({message: "unauthorized"})

    if (userSession.isExpired()) {
        delete sessions[sessionToken]
        res.status(401).end()
        return
    }

    const newSessionToken = uuid.v4()

    const now = new Date()
    const expiresAt = new Date(+now + 120 * 1000)
    const session = new Session(userSession.username, expiresAt)

    sessions[newSessionToken] = session
    delete sessions[sessionToken]

    res.cookie("session_token", newSessionToken, { expires: expiresAt, signed: true})
    next()
}

module.exports = {
    signinHandler,
    welcomeHandler,
    refreshHandler
}