<script setup>
import { reactive, computed } from "vue"
import Pusher from "pusher-js"

// App configuration
import config from "./config.json"

// Components
import Board from "./components/Board.vue"
import Dash from "./components/dashpages/Dash.vue"
import SeekTable from "./components/SeekTable.vue"

// Utility functions
import utils from "./utils/utils"

// Endpoints
const userAuthEndpoint = "/pusher/user-auth"
const channelAuthEndpoint = "/pusher/auth"
const playerDataEndpoint = "/api/player"

// App key
const APP_KEY = config.appKey

const pusher = new Pusher(APP_KEY, {
  userAuthentication: {
    endpoint: userAuthEndpoint,
  },
  channelAuthorization: {
    endpoint: channelAuthEndpoint,
  },
  cluster: 'ap2',
  forceTLS: true,
})
pusher.signin()

let playerId;
const fetchPlayerId = async () => {
  const player = await fetch(playerDataEndpoint).then(res => res.json())
  playerId = player.playerId
  console.log(playerId)
}
fetchPlayerId()

let gameChannel = null

let game = reactive({
  boardDimensions: {
    rows: 10,
    columns: 10,
  },
  gameId: "hello",
  gameMode: "solo",
  rowHeaders: [ [3], [2, 2], [1, 1, 1], [2, 2], [3] ],
  columnHeaders: [ [3], [2, 2], [1, 1, 1], [2, 2], [3] ],
  filledCellsCount: 0,
  emptyCellsCount: 0,
  boardSizeOptions: config.boardSizeOptions,
  gameModeOptions: config.gameModeOptions,
  boardData: undefined, // Temporary: board data must be in server
  boardState: {
    mouseButton: "",
    selectedCells: [],
    data: undefined,
    styleData: undefined,
    cellsAffirmed: 0,
    cellsCrossed: 0
  },
  playerIsConnected: true,
  opponentIsConnected: true,
  opponentId: undefined,
  opponentProgress: {
    cellsAffirmed: 0,
    cellsCrossed: 0
  },
  status: "nogame" // "nogame", "seek", "playing", "gameover"
})

let playerData = computed(() => {
  return {
    playerName: "Player",
    playerIsConnected: game.playerIsConnected,
    playerProgress: {
      filledCells: {
        marked: game.boardState.cellsAffirmed,
        total: game.filledCellsCount
      },
      emptyCells: {
        marked: game.boardState.cellsCrossed,
        total: game.emptyCellsCount
      }
    },
    opponentName: "Opponent",
    opponentIsConnected: game.opponentIsConnected,
    opponentProgress: {
      filledCells: {
        marked: game.opponentProgress.cellsAffirmed,
        total: game.filledCellsCount
      },
      emptyCells: {
        marked: game.opponentProgress.cellsCrossed,
        total: game.emptyCellsCount
      }
    },
  }
})

// Generate board
let boardConfig = utils.generateBoard(game.boardDimensions.rows, game.boardDimensions.columns)
game.rowHeaders.headers = boardConfig.rowHeaders
game.columnHeaders.headers = boardConfig.columnHeaders
game.filledCellsCount = boardConfig.filledCellsCount
game.emptyCellsCount = boardConfig.emptyCellsCount
// Temporary: board data must be in server
game.boardData = boardConfig.board
game.boardState.data = game.boardData.map(row => row.map(cell => 0))
game.boardState.styleData = game.boardData.map(row => row.map(cell => 0))

function setBoardDimensions(dimensions) {
  game.boardDimensions = dimensions
}

function setGameMode(mode) {
  game.gameMode = mode
}

function startGame(boardConfig) {
  game.boardDimensions = { columns: boardConfig.columnHeaders.length, rows: boardConfig.rowHeaders.length }
  game.rowHeaders.headers = boardConfig.rowHeaders
  game.columnHeaders.headers = boardConfig.columnHeaders
  game.filledCellsCount = boardConfig.filledCellsCount
  game.emptyCellsCount = boardConfig.emptyCellsCount
  // Temporary: board data must be in server
  game.boardData = boardConfig.board
  game.boardState.data = game.boardData.map(row => row.map(cell => 0))
  game.boardState.styleData = game.boardData.map(row => row.map(cell => 0))
  game.boardState.cellsAffirmed = game.boardState.cellsCrossed = 0
  game.opponentProgress.cellsAffirmed = game.opponentProgress.cellsCrossed = 0
  game.status = "playing"
}

async function dashButtonClicked(boardSize) {
  if (game.status == "playing") {
    game.opponentId = ""
    game.status = "nogame"
    gameChannel.trigger("client-game-left", {})
    pusher.unsubscribe(gameChannel.name)
  } else if (game.status == "seek") {
    game.status = "nogame"
    pusher.unsubscribe(gameChannel.name)
  } else if (game.status == "join") {
    game.status = "nogame"
  } else if (game.status == "nogame") {
    if (game.gameMode == "1v1-new") {
      game.gameId = utils.generateRandomString(8)
      const channelId = "presence-" + game.gameId
      gameChannel = pusher.subscribe(channelId)
      gameChannel.bind("pusher:subscription_succeeded", () => {
        console.log("Subscribed to channel", gameChannel)
      })
      gameChannel.bind("pusher:member_added", member => {
        // Assign opponent as first player that joins
        if (!game.opponentId) {
          game.opponentId = member.id
          const boardConfig = utils.generateBoard(boardSize.rows, boardSize.columns)
          // Send board configuration to the other player
          gameChannel.trigger("client-game-data", {
            opponentId: playerId,
            boardConfig: boardConfig
          })
          startGame(boardConfig)
        } else {
          if (member.id == game.opponentId) {
            game.opponentIsConnected = true
          }
        }
      })
      gameChannel.bind("pusher:member_removed", member => {
        if (member.id == game.opponentId) {
          game.opponentIsConnected = false
        }
      })
      gameChannel.bind("client-progress-updated", data => {
        game.opponentProgress.cellsAffirmed = data.cellsAffirmed
        game.opponentProgress.cellsCrossed = data.cellsCrossed
      })
      gameChannel.bind("client-game-left", () => {
        game.status = "nogame"
        pusher.unsubscribe(gameChannel.name)
      })
      game.status = "seek"
    } else if (game.gameMode == "1v1-join") {
      game.status = "join"
    } else if (game.gameMode == "solo") {
      const boardConfig = utils.generateBoard(boardSize.rows, boardSize.columns)
      startGame(boardConfig)
    }
  }
}

function joinButtonClicked(gameUrl) {
  const gameId = gameUrl.split("/").pop()
  const channelId = `presence-${gameId}`
  gameChannel = pusher.subscribe(channelId)
  gameChannel.bind("pusher:subscription_succeeded", () => {
    console.log("Subscribed to channel", gameChannel)
  })
  gameChannel.bind("pusher:member_added", member => {
    if (member.id == game.opponentId) {
      game.opponentIsConnected = true
    }
  })
  gameChannel.bind("pusher:member_removed", member => {
    if (member.id == game.opponentId) {
      game.opponentIsConnected = false
    }
  })
  gameChannel.bind("client-game-data", data => {
    game.opponentId = data.opponentId
    console.log("Opponent ID:", game.opponentId)
    startGame(data.boardConfig)
  })
  gameChannel.bind("client-progress-updated", data => {
    game.opponentProgress.cellsAffirmed = data.cellsAffirmed
    game.opponentProgress.cellsCrossed = data.cellsCrossed
  })
  gameChannel.bind("client-game-left", () => {
    game.opponentId = ""
    game.status = "nogame"
    pusher.unsubscribe(gameChannel.name)
  })
}

function mouseLeftBoardGrid() {
  game.boardState.selectedCells = []
}

function cellPressed(e) {
  // Assign mouseButton
  if (e.which == 1) {
    game.boardState.mouseButton = "left"
  } else if (e.which == 3) {
    game.boardState.mouseButton = "right"
  }
  // Coordinates of selected cell
  let row = Number(e.target.getAttribute("data-row"))
  let column = Number(e.target.getAttribute("data-column"))
  // Set selected cells
  game.boardState.selectedCells.push({ row, column })
}

function cellReleased() {
  // Apply action first
  // NOTE: does not apply penalties
  let index = 0
  game.boardState.selectedCells.forEach(cell => {
    const { row, column } = cell
    if (game.boardState.data[row][column] == 0) {
      // First modify boardState.data
      if (game.boardData[row][column]) {
        game.boardState.data[row][column] = 1
        game.boardState.cellsAffirmed++
      } else {
        game.boardState.data[row][column] = 2
        game.boardState.cellsCrossed++
      }
      // Then modify boardState.styleData
      setTimeout(() => {
        game.boardState.styleData[row][column] = game.boardData[row][column] ? 1 : 2
      }, index++ * 100)
    }
  })
  if (game.gameMode == "1v1-new" || game.gameMode == "1v1-join") {
    setTimeout(() => gameChannel.trigger("client-progress-updated", {
      cellsAffirmed: game.boardState.cellsAffirmed,
      cellsCrossed: game.boardState.cellsCrossed
    }), 0)
  }
  // Clear selected cells
  game.boardState.selectedCells = []
}

function cellHovered(e) {
  let row = Number(e.target.getAttribute("data-row"))
  let column = Number(e.target.getAttribute("data-column"))
  if (game.boardState.selectedCells.length > 0) {
    let startRow = game.boardState.selectedCells[0].row
    let startColumn = game.boardState.selectedCells[0].column
    let vDist = Math.abs(row - startRow)
    let hDist = Math.abs(column - startColumn)
    game.boardState.selectedCells = []
    // Populate the selected cells array
    if (vDist > hDist) {
      let direction = row > startRow ? 1 : -1
      for (var i = startRow; i != row + direction; i += direction) {
        game.boardState.selectedCells.push({ row: i, column: startColumn })
      }
    } else {
      let direction = column > startColumn ? 1 : -1
      for (var i = startColumn; i != column + direction; i += direction) {
        game.boardState.selectedCells.push({ row: startRow, column: i })
      }
    }
  }
}
</script>

<template>
  <h1 class="title" 
    :style="{ fontSize: game.status == 'playing' ? '48px' : '64px' }">Squash!</h1>
  <div class="content">
    <Dash
      :boardSizeOptions="game.boardSizeOptions"
      :gameModeOptions="game.gameModeOptions"
      :seekOptions="{ boardDimensions: game.boardDimensions, gameMode: game.gameMode }"
      :gameUrl="'squash-game.vercel.app/' + game.gameId"
      :gameStatus="game.status"
      :playerData="playerData"
      @boardSizeChanged="setBoardDimensions"
      @gameModeChanged="setGameMode"
      @dashButtonClicked="dashButtonClicked"
      @joinButtonClicked="joinButtonClicked" />
    <Board
      :boardData="game.boardData"
      :dimensions="game.boardDimensions"
      :rowHeaders="game.rowHeaders"
      :columnHeaders="game.columnHeaders"
      :state="game.boardState"
      :gameStatus="game.status"
      @cellPressed="cellPressed"
      @cellReleased="cellReleased"
      @cellHovered="cellHovered"
      @mouseLeftBoardGrid="mouseLeftBoardGrid" />
    <SeekTable :gameStatus="game.status" :seekRequests="[]" />
  </div>
</template>

<style scoped>
.content {
  display: grid;
  grid-template-columns: max-content max-content;
  grid-gap: 50px;
  padding: 50px;
  justify-content: center;
  justify-items: center;
  align-items: center;
}
.title {
  font-family: "Arial Rounded";
  font-size: 64px;
  text-align: center;
  transition: 0.2s;
  color: var(--color-primary);
}

.title.hide {
  display: none;
}
</style>