<script setup>
import { reactive } from "vue"

// App configuration
import config from "./config.json"

// Components
import Title from "./components/Title.vue"
import Board from "./components/Board.vue"
import Dash from "./components/Dash.vue"

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
  boardSizeOptions: config.boardSizeOptions,
  gameModeOptions: config.gameModeOptions,
  boardData: undefined, // Temporary: board data must be in server
  boardState: {
    mouseButton: "",
    selectedCells: [],
    data: undefined
  },
  status: "nogame"
})
// Generate board
let boardConfig = generateBoard(game.boardDimensions.rows, game.boardDimensions.columns)
game.rowHeaders = boardConfig.rowHeaders
game.columnHeaders = boardConfig.columnHeaders
// Temporary: board data must be in server
game.boardData = boardConfig.board
game.boardState.data = game.boardData.map(row => row.map(cell => 0))

function seekButtonClicked(boardSize) {
  console.log(boardSize)
  let boardConfig = generateBoard(boardSize.rows, boardSize.columns)
  game.boardDimensions = { columns: boardSize.columns, rows: boardSize.rows }
  game.rowHeaders = boardConfig.rowHeaders
  game.columnHeaders = boardConfig.columnHeaders
  // Temporary: board data must be in server
  game.boardData = boardConfig.board
  game.boardState.data = game.boardData.map(row => row.map(cell => 0))
}

function generateBoard2(rows, columns) {
  // The resulting board configuration
  let board = Array(rows)
  let rowHeaders = Array(rows).fill().map(_ => [])
  let columnHeaders = Array(columns).fill().map(_ => [])
  // Generate board and row headers
  for (var i = 0; i < rows; i++) {
    let row = Array(columns)
    let index = 0
    // Whether to start the row with an empty or filled cell
    let fill = Boolean(Math.floor(Math.random() * 2))
    while (index < columns) {
      // Number of connected cells (can be empty or filled)
      let connectedCells = Math.ceil(Math.random() * (columns - index))
      for (var _ = 0; _ < connectedCells; _++) {
        row[index++] = fill
      }
      if (fill) {
        rowHeaders[i].push(connectedCells)
      }
      fill = !fill
    }
    if (rowHeaders[i].length == 0) rowHeaders[i] = [0]
    board[i] = row
  }
  // Generate column headers
  for (var c = 0; c < columns; c++) {
    let isFilled = board[0][c]
    let currentLength = 0
    for (var r = 0; r < rows; r++) {
      if (board[r][c] == isFilled) {
        currentLength++
      } else {
        if (isFilled) columnHeaders[c].push(currentLength)
        currentLength = 1
        isFilled = !isFilled
      }
    }
    if (isFilled) columnHeaders[c].push(currentLength)
    if (columnHeaders[c].length == 0) columnHeaders[c] = [0]
  }
  return { board, rowHeaders, columnHeaders }
}

function generateBoard(rows, columns) {
  // The resulting board configuration
  let board = Array(rows)
  let rowHeaders = Array(rows).fill().map(_ => [])
  let columnHeaders = Array(columns).fill().map(_ => [])

  for (var r = 0; r < rows; r++) {
    let row = Array(columns)
    for (var c = 0; c < columns; c++) {
      row[c] = (Math.random() - 0.4 > 0)
    }
    board[r] = row
  }

  // Generate row headers
  for (var r = 0; r < rows; r++) {
    let isFilled = board[r][0]
    let currentLength = 0
    for (var c = 0; c < columns; c++) {
      if (board[r][c] == isFilled) {
        currentLength++
      } else {
        if (isFilled) rowHeaders[r].push(currentLength)
        currentLength = 1
        isFilled = !isFilled
      }
    }
    if (isFilled) rowHeaders[r].push(currentLength)
    if (rowHeaders[r].length == 0) rowHeaders[r] = [0]
  }

  // Generate column headers
  for (var c = 0; c < columns; c++) {
    let isFilled = board[0][c]
    let currentLength = 0
    for (var r = 0; r < rows; r++) {
      if (board[r][c] == isFilled) {
        currentLength++
      } else {
        if (isFilled) columnHeaders[c].push(currentLength)
        currentLength = 1
        isFilled = !isFilled
      }
    }
    if (isFilled) columnHeaders[c].push(currentLength)
    if (columnHeaders[c].length == 0) columnHeaders[c] = [0]
  }

  return { board, rowHeaders, columnHeaders }
}
</script>

<template>
  <Title :class="['title', game.status != 'nogame' ? 'hide' : '']" />
  <div class="content">
    <Board
      :boardData="game.boardData"
      :dimensions="game.boardDimensions" 
      :rowHeaders="game.rowHeaders"
      :columnHeaders="game.columnHeaders"
      :state="game.boardState" />
    <Dash
      :boardSizeOptions="game.boardSizeOptions"
      :gameModeOptions="game.gameModeOptions"
      @seek="seekButtonClicked" />
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