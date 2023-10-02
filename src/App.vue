<script setup>
import { reactive, computed } from "vue"
import { io } from "socket.io-client"

// App configuration
import config from "./config.json"

// Socket.io
// const socketUrl = process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";
// const socket = io(socketUrl)

// socket.on("connect", () => {
//   console.log("Connected to WebSocket")
// })

// socket.on("disconnect", () => {
//   console.log("Connected to WebSocket")
// })

// socket.on("seekUpdate", updatedSeekRequests => {
//   seekRequests = updatedSeekRequests
// })

// Components
import Board from "./components/Board.vue"
import Dash from "./components/dashpages/Dash.vue"
import SeekTable from "./components/SeekTable.vue"

// Utility functions
import utils from "./utils/utils"

// Active seek requests
let seekRequests = reactive([
  { playerId: "player", playerName: "Player", boardDimensions: { rows: 5, columns: 5 }, rating: 2000 }
])

let game = reactive({
  boardDimensions: {
    rows: 10,
    columns: 10,
  },
  gameMode: "solo",
  rowHeaders: {
    haeders: [ [3], [2, 2], [1, 1, 1], [2, 2], [3] ],
    crossedStatus: [ false, false, false, false, false ] // true: crossed, false: not crossed
  },
  columnHeaders: {
    haeders: [ [3], [2, 2], [1, 1, 1], [2, 2], [3] ],
    crossedStatus: [ false, false, false, false, false ] // true: crossed, false: not crossed
  },
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
    cellsCrossed: 0,
  },
  status: "nogame" // "nogame", "seek", "playing", "gameover"
})

let playerData = computed(() => {
  return {
    playerName: "Player",
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
    opponentProgress: {
      filledCells: {
        marked: 0,
        total: game.filledCellsCount
      },
      emptyCells: {
        marked: 0,
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

async function dashButtonClicked(boardSize) {
  if (game.status == "playing") {
    game.status = "nogame"
  } else {
    const seek = await utils.newSeek({
      playerId: "Wais_m3198nfmdwd1",
      boardDimensions: boardSize
    })
    seekRequests.length = 0  // Assigning to empty array disables reactivity
    seekRequests.push(...seek)
    // return;

    let boardConfig = utils.generateBoard(boardSize.rows, boardSize.columns)
    game.boardDimensions = { columns: boardSize.columns, rows: boardSize.rows }
    game.rowHeaders.headers = boardConfig.rowHeaders
    game.rowHeaders.crossedStatus = boardConfig.rowHeaders.map(item => false)
    game.columnHeaders.headers = boardConfig.columnHeaders
    game.columnHeaders.crossedStatus = boardConfig.columnHeaders.map(item => false)
    game.filledCellsCount = boardConfig.filledCellsCount
    game.emptyCellsCount = boardConfig.emptyCellsCount
    // Temporary: board data must be in server
    game.boardData = boardConfig.board
    game.boardState.data = game.boardData.map(row => row.map(cell => 0))
    game.boardState.styleData = game.boardData.map(row => row.map(cell => 0))
    game.boardState.cellsAffirmed = game.boardState.cellsCrossed = 0
    game.status = "playing"
  }
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
    if (game.boardState.data[cell.row][cell.column] == 0) {
      // First modify boardState.data
      if (game.boardData[cell.row][cell.column]) {
        game.boardState.data[cell.row][cell.column] = 1
        game.boardState.cellsAffirmed++
      } else {
        game.boardState.data[cell.row][cell.column] = 2
        game.boardState.cellsCrossed++
      }
      // Then modify boardState.styleData
      setTimeout(() => {
        game.boardState.styleData[cell.row][cell.column] = game.boardData[cell.row][cell.column] ? 1 : 2
      }, index++ * 100)
    }
  })
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
    :style="{ fontSize: game.status == 'nogame' ? '64px' : '48px' }">Squash!</h1>
  <div class="content">
    <Dash
      :boardSizeOptions="game.boardSizeOptions"
      :gameModeOptions="game.gameModeOptions"
      :seekOptions="{ boardDimensions: game.boardDimensions, gameMode: game.gameMode }"
      :gameStatus="game.status"
      :playerData="playerData"
      @boardSizeChanged="setBoardDimensions"
      @gameModeChanged="setGameMode"
      @dashButtonClicked="dashButtonClicked" />
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
    <SeekTable :gameStatus="game.status" :seekRequests="seekRequests" />
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