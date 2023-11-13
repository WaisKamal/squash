<script setup>
import { computed, toRaw } from "vue"

let props = defineProps({
  cellNumber: Number,    // The order of the cell in the currently selected cells
  cellState: Object      // {
                         //   coords: cell row and column
                         //   cellStatus: 0 - "none", 1 - "affirmed", 2 - "crossed"
                         //   cellSelected: whether the cell is currently selected
                         //   mouseButton: the currently active mouse button "left"/"right"
                         //   hoveredCell: the coordinates (row and column) of the currently hovered-over cell
                         // }
})

let cellClass = computed(() => {
  let computedCellClassList = []
  if (props.cellState.cellSelected) {
    computedCellClassList.push(props.cellState.mouseButton == "left" ? "marked" : "unmarked")
  }
  if (props.cellState.cellStatus == 1) {
    computedCellClassList.push("affirmed")
  } else if (props.cellState.cellStatus == 2) {
    computedCellClassList.push("crossed")
  }
  if (props.cellState.coords.row == props.cellState.hoveredCell.row) {
    computedCellClassList.push("row-highlighted")
  }
  if (props.cellState.coords.column == props.cellState.hoveredCell.column) {
    computedCellClassList.push("column-highlighted")
  }
  return computedCellClassList
})
</script>

<template>
  <div class="cell" :class="cellClass">
    <img :class="cellClass.includes('affirmed') ? 'shown' : ''" src="@/assets/img/affirmed.png" />
    <img :class="cellClass.includes('crossed') ? 'shown' : ''" src="@/assets/img/crossed.png" />
    <span v-show="props.cellNumber > 0" >{{ props.cellNumber > 0 ? cellNumber : '' }}</span>
  </div>
</template>

<style scoped>
.cell {
  position: relative;
  display: flex;
  width: 30px;
  height: 30px;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: var(--bg-color);
}

.cell * {
  position: absolute;
  display: block;
  pointer-events: none;
}

.cell img {
  /* width: 100%;
  height: 100%; */
  opacity: 0;
  transition: 0.2s;
}

.cell img.shown {
  opacity: 1;
}

.cell span {
  width: 20px;
  height: 20px;
  padding: 2px 0px;
  border-radius: 10px;
  line-height: 1;
  text-align: center;
  color: #FFF;
  background: rgba(0, 0, 0, 0.5);
}

.cell.crossed {
  transition: background 0.2s;
}

.cell.affirmed {
  transition: background 0.2s;
}

.cell.marked {
  box-shadow: 0px 0px 3px 2px var(--color-primary) inset;
  transition: none;
}

.cell.unmarked {
  box-shadow: 0px 0px 3px 2px var(--color-cell-crossed) inset;
  transition: none;
}

.cell.row-highlighted:not(.marked, .unmarked) {
  border-top: 2px solid var(--border-color);
  border-bottom: 2px solid var(--border-color);
}

.cell.column-highlighted:not(.marked, .unmarked) {
  border-left: 2px solid var(--border-color);
  border-right: 2px solid var(--border-color);
}
</style>
