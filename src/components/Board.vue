<script setup>
import { computed, toRaw } from "vue";
import RowHeaders from "./RowHeaders.vue";
import ColumnHeaders from "./ColumnHeaders.vue";
import Cell from "./Cell.vue"

const emit = defineEmits(["cellMarked"])

// Board data
const data = defineProps({
  dimensions: Object,   // Board dimensions - { rows, columns }
  rowHeaders: Array,    // Row headers
  columnHeaders: Array, // Column headers
  boardData: Array,     // 2D array (true = cell to be affirmed, false = cell to be crossed)
  state: Object,        // {
                        //   data: 2D array (0 = empty, 1 = affirmed, 2 = crossed)
                        //   mouseButton: the mouse button currently clicked ("left", "right", or "")
                        //   selectedCells: array of elements { row, column }
                        // }
  cellsMarked: Number,  // Number of cells that have been marked
  gameStatus: String    // "nogame", "seek", "playing", "gameover"
})

// Board grid configuration
const boardStyle = computed(() => {
  return {
    "grid-template-columns": `repeat(${data.dimensions.columns}, auto)`
  }
})

function cellPressed(e) {
  // Assign mouseButton
  if (e.which == 1) {
    data.state.mouseButton = "left"
  } else if (e.which == 3) {
    data.state.mouseButton = "right"
  }
  // Coordinates of selected cell
  let row = Number(e.target.getAttribute("data-row"))
  let column = Number(e.target.getAttribute("data-column"))
  // Set selected cells
  data.state.selectedCells.push({ row, column })
}

function cellReleased(e) {
  // Apply action first
  // NOTE: does not apply penalties
  let index = 0
  data.state.selectedCells.forEach((cell) => {
    if (data.state.data[cell.row][cell.column] == 0) {
      // Notify App.vue that a cell has been marked
      emit("cellMarked")
      setTimeout(() => {
        data.state.data[cell.row][cell.column] = data.boardData[cell.row][cell.column] ? 1 : 2
      }, index++ * 100)
    }
  })
  // Clear selected cells
  data.state.selectedCells = []
}

function cellHovered(e) {
  let row = Number(e.target.getAttribute("data-row"))
  let column = Number(e.target.getAttribute("data-column"))
  if (data.state.selectedCells.length > 0) {
    let startRow = data.state.selectedCells[0].row
    let startColumn = data.state.selectedCells[0].column
    let vDist = Math.abs(row - startRow)
    let hDist = Math.abs(column - startColumn)
    data.state.selectedCells = []
    // Populate the selected cells array
    if (vDist > hDist) {
      let direction = row > startRow ? 1 : -1
      for (var i = startRow; i != row + direction; i += direction) {
        data.state.selectedCells.push({ row: i, column: startColumn })
      }
    } else {
      let direction = column > startColumn ? 1 : -1
      for (var i = startColumn; i != column + direction; i += direction) {
        data.state.selectedCells.push({ row: startRow, column: i })
      }
    }
  }
}

function mouseLeftBoardGrid() {
  data.state.selectedCells = []
}

// Utility function that takes array of cells { row, column } and cell number
// (starting at 1 and going left-to-right) and outputs whether the cell exists
// in the array
function cellExists(arr, cellOrder) {
  let row = Math.floor((cellOrder - 1) / data.dimensions.columns)
  let column = (cellOrder - 1) % data.dimensions.columns
  return arr.filter(cell => cell.row == row && cell.column == column).length > 0
}

// Utility function to decide Cell class based on board state
function getCellClass(cellOrder) {
  let row = Math.floor((cellOrder - 1) / data.dimensions.columns)
  let column = (cellOrder - 1) % data.dimensions.columns
  let classes = ["", "affirmed", "crossed"]
  return classes[data.state.data[row][column]]
}
</script>

<template>
  <div class="board" v-show="data.gameStatus != 'nogame'">
    <div></div>
    <ColumnHeaders :headers="data.columnHeaders" />
    <RowHeaders :headers="data.rowHeaders" />
    <div class="grid" :style="boardStyle"
      @mouseleave="mouseLeftBoardGrid"
      @contextmenu.prevent="">
      <Cell
        v-for="i in data.dimensions.columns * data.dimensions.rows"
        :class="[cellExists(data.state.selectedCells, i) ? data.state.mouseButton == 'left' ? 'marked' : 'unmarked' : '', getCellClass(i)]"
        :data-row="Math.floor((i - 1) / data.dimensions.columns)"
        :data-column="(i - 1) % data.dimensions.columns"
        @mousedown="cellPressed"
        @mouseup="cellReleased"
        @mouseover="cellHovered"
        @contextmenu.prevent="" />
    </div>
  </div>
</template>

<style scoped>
.board {
  display: grid;
  grid-template-rows: min-content min-content;
  grid-template-columns: min-content min-content;
  grid-gap: 1px;
  border-radius: 50px 0px 0px 0px;
}

.board .grid {
  display: grid;
  grid-gap: 1px;
  border: 1px solid #DDD;
  background: #DDD;
}
</style>