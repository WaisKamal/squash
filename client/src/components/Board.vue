<script setup>
import { reactive, computed, toRaw } from "vue";
import RowHeaders from "./RowHeaders.vue";
import ColumnHeaders from "./ColumnHeaders.vue";
import Cell from "./Cell.vue"

const emit = defineEmits(["cellPressed", "cellReleased", "cellHovered", "mouseLeftBoardGrid"])

// Board data
const data = defineProps({
  dimensions: Object,    // Board dimensions - { rows, columns }
  rowHeaders: Array,     // Row headers
  columnHeaders: Array,  // Column headers
  boardData: Array,      // 2D array (true = cell to be affirmed, false = cell to be crossed)
  state: Object,         // {
                         //   data: 2D array of cells (0 = empty, 1 = affirmed, 2 = crossed)
                         //   styleData: same as data, just gets assigned in a setTimeout call
                         //   mouseButton: the mouse button currently clicked ("left", "right", or "")
                         //   selectedCells: array of selected cells in format { row, column }
                         // }
  cellsMarked: Number,   // Number of cells that have been marked
  gameStatus: String     // "nogame", "seek", "playing", "gameover"
})

let hoveredCell = reactive({
  row: -1,
  column: -1
})

// Board grid configuration
const boardStyle = computed(() => {
  return {
    "grid-template-columns": `repeat(${data.dimensions.columns}, auto)`
  }
})

function mouseLeftBoardGrid() {
  emit("mouseLeftBoardGrid")
}

function cellPressed(e) {
  emit("cellPressed", e)
}

function cellReleased() {
  emit("cellReleased")
}

function cellHovered(e) {
  hoveredCell.row = Number(e.target.getAttribute("data-row"))
  hoveredCell.column = Number(e.target.getAttribute("data-column"))
  emit("cellHovered", e)
}

function cellLeft() {
  hoveredCell.row = -1
  hoveredCell.column = -1
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

// Utility function to get Cell status
function getCellStatus(cellOrder) {
  let { row, column } = getCellRowAndColumn(cellOrder)
  // let classes = ["", "affirmed", "crossed"]
  return data.state.styleData[row][column]
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
  <div class="board" v-if="data.gameStatus == 'playing'">
    <div></div>
    <ColumnHeaders :columnHeaders="columnHeaders" />
    <RowHeaders :rowHeaders="rowHeaders" />
    <div class="grid" :style="boardStyle"
      @mouseleave="mouseLeftBoardGrid"
      @contextmenu.prevent="">
      <Cell
        v-for="i in data.dimensions.columns * data.dimensions.rows"
        :data-row="Math.floor((i - 1) / data.dimensions.columns)"
        :data-column="(i - 1) % data.dimensions.columns"
        :cellNumber="getCellNumber(i)"
        :cellState="reactive({
          coords: getCellRowAndColumn(i),
          cellStatus: getCellStatus(i),
          cellSelected: cellExists(data.state.selectedCells, i),
          mouseButton: data.state.mouseButton,
          hoveredCell: hoveredCell
        })"
        @mousedown="cellPressed"
        @mouseup="cellReleased"
        @mouseleave="cellLeft"
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
  user-select: none;
}

.board .grid {
  display: grid;
  grid-gap: 1px;
  border: 1px solid var(--border-color);
  background: var(--border-color);
}
</style>