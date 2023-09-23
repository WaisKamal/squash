<script setup>
import { computed, toRaw } from "vue";
import RowHeaders from "./RowHeaders.vue";
import ColumnHeaders from "./ColumnHeaders.vue";
import Cell from "./Cell.vue"

const emit = defineEmits(["cellPressed", "cellReleased", "cellHovered"])

// Board data
const data = defineProps({
  dimensions: Object,   // Board dimensions - { rows, columns }
  rowHeaders: Array,    // Row headers
  columnHeaders: Array, // Column headers
  boardData: Array,     // 2D array (true = cell to be affirmed, false = cell to be crossed)
  state: Object,        // {
                        //   data: 2D array of cells (0 = empty, 1 = affirmed, 2 = crossed)
                        //   styleData: same as data, just gets assigned in a setTimeout call
                        //   mouseButton: the mouse button currently clicked ("left", "right", or "")
                        //   selectedCells: array of selected cells in format { row, column }
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

function mouseLeftBoardGrid() {
  data.state.selectedCells = []
}

function cellPressed(e) {
  emit("cellPressed", e)
}

function cellReleased() {
  emit("cellReleased")
}

function cellHovered(e) {
  emit("cellHovered", e)
}

// Utility function that takes array of cells { row, column } and cell number
// (starting at 1 and going left-to-right) and outputs whether the cell exists
// in the array
function cellExists(arr, cellOrder) {
  let row = Math.floor((cellOrder - 1) / data.dimensions.columns)
  let column = (cellOrder - 1) % data.dimensions.columns
  return arr.filter(cell => cell.row == row && cell.column == column).length > 0
}


// Utility function to get cell row and column
function getCellRowAndColumn(cellOrder) {
  let row = Math.floor((cellOrder - 1) / data.dimensions.columns)
  let column = (cellOrder - 1) % data.dimensions.columns
  return { row, column }
}

// Utility function to decide Cell class based on board state
function getCellClass(cellOrder) {
  let { row, column } = getCellRowAndColumn(cellOrder)
  let classes = ["", "affirmed", "crossed"]
  return classes[data.state.styleData[row][column]]
}

// Utility function to extract cell order (starting at 1) in selected cells
function getCellNumber(cellOrder) {
  let { row, column } = getCellRowAndColumn(cellOrder)
  return data.state.selectedCells.findIndex(cell => {
    return cell.row == row && cell.column == column 
  }) + 1
}
</script>

<template>
  <div class="board" v-show="data.gameStatus != 'nogame'">
    <div></div>
    <ColumnHeaders :headers="columnHeaders" />
    <RowHeaders :headers="data.rowHeaders" />
    <div class="grid" :style="boardStyle"
      @mouseleave="mouseLeftBoardGrid"
      @contextmenu.prevent="">
      <Cell
        v-for="i in data.dimensions.columns * data.dimensions.rows"
        :data-row="Math.floor((i - 1) / data.dimensions.columns)"
        :data-column="(i - 1) % data.dimensions.columns"
        :cellNumber="getCellNumber(i)"
        :cellState="[cellExists(data.state.selectedCells, i) ? data.state.mouseButton == 'left' ? 'marked' : 'unmarked' : '', getCellClass(i)]"
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