<script setup>
import { reactive, computed } from "vue";
import RowHeaders from "./RowHeaders.vue";
import ColumnHeaders from "./ColumnHeaders.vue";
import Cell from "./Cell.vue"

// Board data
const data = defineProps({
  dimensions: Object,
  rowHeaders: Array,
  columnHeaders: Array,
  boardData: Array
})

// Board state
const state = reactive({
  // return {
    mouseButton: "",   // The clicked mouse button
    selectedCells: [],
    // Initialize board cells to zero
    // 0: not filled, 1: affirmed, 2: crossed
    data: data.boardData.map(row => row.map(cell => 0))
  // }
})

// Board grid configuration
const boardStyle = computed(() => {
  return {
    "grid-template-columns": `repeat(${data.dimensions.width}, auto)`
  }
})

function cellPressed(e) {
  if (e.which == 1) {
    state.mouseButton = "left"
  } else if (e.which == 3) {
    state.mouseButton = "right"
  }
  let row = Number(e.target.getAttribute("data-row"))
  let column = Number(e.target.getAttribute("data-column"))
  // Set selected cells
  state.selectedCells.push({ row, column })
}

function cellReleased(e) {
  // Apply action first
  // NOTE: does not apply penalties
  let index = 0
  state.selectedCells.forEach((cell) => {
    if (state.data[cell.row][cell.column] == 0) {
      setTimeout(() => {
        state.data[cell.row][cell.column] = data.boardData[cell.row][cell.column] ? 1 : 2
      }, index++ * 100)
    }
  })
  // Clear selected cells
  state.selectedCells = []
}

function cellHovered(e) {
  let row = Number(e.target.getAttribute("data-row"))
  let column = Number(e.target.getAttribute("data-column"))
  if (state.selectedCells.length > 0) {
    let startRow = state.selectedCells[0].row
    let startColumn = state.selectedCells[0].column
    let vDist = Math.abs(row - startRow)
    let hDist = Math.abs(column - startColumn)
    state.selectedCells = []
    // Populate the selected cells array
    if (vDist > hDist) {
      let direction = row > startRow ? 1 : -1
      for (var i = startRow; i != row + direction; i += direction) {
        state.selectedCells.push({ row: i, column: startColumn })
      }
    } else {
      let direction = column > startColumn ? 1 : -1
      for (var i = startColumn; i != column + direction; i += direction) {
        state.selectedCells.push({ row: startRow, column: i })
      }
    }
  }
}

function mouseLeftBoardGrid() {
  state.selectedCells = []
}

// Utility function that takes array of cells and cell number (starting at 1)
// and outputs whether the cell exists in the array
function cellExists(arr, cellOrder) {
  let row = Math.floor((cellOrder - 1) / data.dimensions.width)
  let column = (cellOrder - 1) % data.dimensions.width
  return arr.filter(cell => cell.row == row && cell.column == column).length > 0
}

// Utility function to decide Cell class based on board state
function getCellClass(cellOrder) {
  let row = Math.floor((cellOrder - 1) / data.dimensions.width)
  let column = (cellOrder - 1) % data.dimensions.width
  let classes = ["", "affirmed", "crossed"]
  return classes[state.data[row][column]]
}
</script>

<template>
  <div class="board">
    <div />
    <ColumnHeaders :headers="data.columnHeaders" />
    <RowHeaders :headers="data.rowHeaders" />
    <div class="grid" :style="boardStyle"
      @mouseleave="mouseLeftBoardGrid"
      @contextmenu.prevent="">
      <Cell
        v-for="i in data.dimensions.width * data.dimensions.height"
        :class="[cellExists(state.selectedCells, i) ? state.mouseButton == 'left' ? 'marked' : 'unmarked' : '', getCellClass(i)]"
        :data-row="Math.floor((i - 1) / data.dimensions.width)"
        :data-column="(i - 1) % data.dimensions.width"
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
  padding: 20px;
  border: 1px solid var(--color-primary);
  border-radius: 50px 0px 0px 0px;
  /* box-shadow: 0px 0px 50px 0px var(--color-primary); */
  /* background: #F9F9F9; */
}

.board .grid {
  display: grid;
  grid-gap: 1px;
  border: 1px solid #DDD;
  background: #DDD;
}
</style>