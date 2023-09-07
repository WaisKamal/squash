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
  boardSizeOptions: config.boardSizeOptions,
  gameModeOptions: config.gameModeOptions,
  boardData: undefined, // Temporary: board data must be in server
  boardState: {
    mouseButton: "",
    selectedCells: [],
    data: undefined,
    cellsMarked: 0,
  },
  status: "nogame" // "nogame", "seek", "playing", "gameover"
})

let playerData = computed(() => {
  return {
    playerName: "Player",
    playerProgress: 100 * game.boardState.cellsMarked /
                    (game.boardDimensions.rows * game.boardDimensions.columns),
    opponentName: "Opponent",
    opponentProgress: 0
  }
})

// Generate board
let boardConfig = utils.generateBoard(game.boardDimensions.rows, game.boardDimensions.columns)
game.rowHeaders = boardConfig.rowHeaders
game.columnHeaders = boardConfig.columnHeaders
// Temporary: board data must be in server
game.boardData = boardConfig.board
game.boardState.data = game.boardData.map(row => row.map(cell => 0))

function cellMarked() {
  console.log(game.boardState.cellsMarked)
  game.boardState.cellsMarked++
}

function dashButtonClicked(boardSize) {
  if (game.status == "playing") {
    game.status = "nogame"
  } else {
    let boardConfig = utils.generateBoard(boardSize.rows, boardSize.columns)
    game.boardDimensions = { columns: boardSize.columns, rows: boardSize.rows }
    game.rowHeaders = boardConfig.rowHeaders
    game.columnHeaders = boardConfig.columnHeaders
    // Temporary: board data must be in server
    game.boardData = boardConfig.board
    game.boardState.data = game.boardData.map(row => row.map(cell => 0))
    game.status = "playing"
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
      @cellMarked="cellMarked" />
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