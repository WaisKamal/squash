import Pusher from 'pusher';
import express from 'express'
import session from 'express-session';
import cors from 'cors'
import path from 'path';
import { fileURLToPath } from 'url';
import utils from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = 3000

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

const pusher = new Pusher({
    appId: "1677874",
    key: "7ac779fdc52b29158df6",
    secret: "10c67e4d409540dee173",
    cluster: "ap2",
    forceTLS: true,
});

app.get("/", (req, res) => {
    req.session.playerId = "player-" + utils.generateGameId()
    res.sendFile(__dirname + '/public/index.html')
})

app.use(express.static("public"))

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