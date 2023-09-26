<script setup>
import { reactive, computed } from "vue"

// App configuration
import config from "./config.json"

// Components
import Title from "./components/Title.vue"
import Board from "./components/Board.vue"
import Dash from "./components/dashpages/Dash.vue"
import SeekTable from "./components/SeekTable.vue"

// Utility functions
import utils from "./utils/utils"

// Active seek requests
let seekRequests = reactive([
  { player: "Player", boardSize: { width: 10, height: 10 }, rating: 2000 },
  { player: "Player", boardSize: { width: 10, height: 10 }, rating: 2000 },
  { player: "Player", boardSize: { width: 10, height: 10 }, rating: 2000 },
  { player: "Player", boardSize: { width: 10, height: 10 }, rating: 2000 },
  { player: "Player", boardSize: { width: 10, height: 10 }, rating: 2000 },
  { player: "Player", boardSize: { width: 10, height: 10 }, rating: 2000 },
  { player: "Player", boardSize: { width: 10, height: 10 }, rating: 2000 },
  { player: "Player", boardSize: { width: 10, height: 10 }, rating: 2000 },
  { player: "Player", boardSize: { width: 10, height: 10 }, rating: 2000 }
])

let game = reactive({
  boardDimensions: {
    rows: 10,
    columns: 10,
  },
  rowHeaders: [
    [3],
    [2, 2],
    [1, 1, 1],
    [2, 2],
    [3]
  ],
  columnHeaders: [
    [3],
    [2, 2],
    [1, 1, 1],
    [2, 2],
    [3]
  ],
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
        total: 0
      },
      emptyCells: {
        marked: 0,
        total: 0
      }
    },
  }
})

// Generate board
let boardConfig = utils.generateBoard(game.boardDimensions.rows, game.boardDimensions.columns)
game.rowHeaders = boardConfig.rowHeaders
game.columnHeaders = boardConfig.columnHeaders
game.filledCellsCount = boardConfig.filledCellsCount
game.emptyCellsCount = boardConfig.emptyCellsCount
// Temporary: board data must be in server
game.boardData = boardConfig.board
game.boardState.data = game.boardData.map(row => row.map(cell => 0))
game.boardState.styleData = game.boardData.map(row => row.map(cell => 0))

function dashButtonClicked(boardSize) {
  if (game.status == "playing") {
    game.status = "nogame"
  } else {
    let boardConfig = utils.generateBoard(boardSize.rows, boardSize.columns)
    game.boardDimensions = { columns: boardSize.columns, rows: boardSize.rows }
    game.rowHeaders = boardConfig.rowHeaders
    game.columnHeaders = boardConfig.columnHeaders
    game.filledCellsCount = boardConfig.filledCellsCount
    game.emptyCellsCount = boardConfig.emptyCellsCount
    // Temporary: board data must be in server
    game.boardData = boardConfig.board
    game.boardState.data = game.boardData.map(row => row.map(cell => 0))
    game.boardState.styleData = game.boardData.map(row => row.map(cell => 0))
    game.boardState.cellsMarked = 0
    game.status = "playing"
  }
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
  <Title class="title" v-show="game.status == 'nogame'"/>
  <div class="content">
    <Board
      :boardData="game.boardData"
      :dimensions="game.boardDimensions"
      :rowHeaders="game.rowHeaders"
      :columnHeaders="game.columnHeaders"
      :state="game.boardState"
      :gameStatus="game.status"
      @cellPressed="cellPressed"
      @cellReleased="cellReleased"
      @cellHovered="cellHovered" />
    <Dash
      :boardSizeOptions="game.boardSizeOptions"
      :gameModeOptions="game.gameModeOptions"
      :gameStatus="game.status"
      :playerData="playerData"
      @dashButtonClicked="dashButtonClicked" />
    <SeekTable :gameStatus="game.status" :seekRequests="seekRequests" />
  </div>
</template>

<style scoped>
.content {
  display: grid;
  grid-template-columns: max-content max-content;
  grid-gap: 100px;
  padding: 50px;
  justify-content: center;
  justify-items: center;
  align-items: center;
}
</style>