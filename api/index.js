import Pusher from 'pusher';
import express from 'express'
import session from 'express-session';
import cors from 'cors'
import path from 'path';
import { fileURLToPath } from 'url';
import utils from './_utils.js';

const APP_ID_DEFAULT = "your_app_id_here"
const APP_KEY_DEFAULT = "your_app_key_here"
const APP_SECRET_DEFAULT = "your_app_secret_here"
const APP_CLUSTER_DEFAULT = "your_app_cluster_here"

const APP_ID = process.env.APP_ID || APP_ID_DEFAULT
const APP_KEY = process.env.APP_KEY || APP_KEY_DEFAULT
const APP_SECRET = process.env.APP_SECRET || APP_SECRET_DEFAULT
const APP_CLUSTER = process.env.APP_CLUSTER || APP_CLUSTER_DEFAULT

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 3000

const app = express()
app.use(session({
    secret: 'somesecrethere',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false,
    }
}))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded())
app.use(express.static("public", {
    index: false
}))

const pusher = new Pusher({
    appId: APP_ID,
    key: APP_KEY,
    secret: APP_SECRET,
    cluster: APP_CLUSTER,
    forceTLS: true,
});

app.get("/", (req, res) => {
    req.session.playerId = "player-" + utils.generateGameId()
    res.sendFile(__dirname + "/public/index.html")
})

app.get("/api/player", (req, res) => {
    if (!req.session.playerId) {
        req.session.playerId = "player-" + utils.generateGameId()
    }
    const result = {
        playerId: req.session.playerId
    }
    res.send(JSON.stringify(result))
})

app.post("/pusher/auth", (req, res) => {
    if (!req.session.playerId) {
        req.session.playerId = "player-" + utils.generateGameId()
    }
    const { socket_id, channel_name } = req.body
    const user = {
        user_id: req.session.playerId,
        user_info: {
            name: "Player " + req.session.playerId.split("-")[0]
        },
        watchlist: []
    }
    const auth = pusher.authorizeChannel(socket_id, channel_name, user);
    res.send(auth);
})

app.post("/pusher/user-auth", (req, res) => {
    if (!req.session.playerId) {
        req.session.playerId = "player-" + utils.generateGameId()
    }
    const socket_id = req.body.socket_id;
    const user = {
        id: req.session.playerId,
        user_info: {
            name: "Player " + req.session.playerId.split("-")[0]
        },
        watchlist: []
    };
    const userAuth = pusher.authenticateUser(socket_id, user)
    console.log(userAuth)
    res.send(userAuth)
})

app.listen(port, () => console.log(`Squash server running on port ${port}`))

export default app