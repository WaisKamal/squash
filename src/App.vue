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
    columns: 15,        // Number of columns
    height: 15,       // Number of rows
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
  status: "nogame",
  boardData: undefined // Temporary: board data must be in server
})
// Generate board
let boardConfig = generateBoard(game.boardDimensions.height, game.boardDimensions.columns)
game.rowHeaders = boardConfig.rowHeaders
game.columnHeaders = boardConfig.columnHeaders
// Temporary: board data must be in server
game.boardData = boardConfig.board

function seekButtonClicked(boardSize) {
  console.log(boardSize)
  let boardConfig = generateBoard(boardSize.columns, boardSize.height)
  game.boardDimensions = { columns: boardSize.columns, height: boardSize.height }
  game.rowHeaders = boardConfig.rowHeaders
  game.columnHeaders = boardConfig.columnHeaders
  // Temporary: board data must be in server
  game.boardData = boardConfig.board
}

function generateBoard(rows, columns) {
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
</script>

<template>
  <Title :class="['title', game.status != 'nogame' ? 'hide' : '']" />
  <div class="content">
    <Board
      :boardData="game.boardData"
      :dimensions="game.boardDimensions" 
      :rowHeaders="game.rowHeaders"
      :columnHeaders="game.columnHeaders" />
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