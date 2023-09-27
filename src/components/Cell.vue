<script setup>
let props = defineProps({
  cellNumber: Number,    // The order of the cell in the currently selected cells
  cellState: Array      // One of "marked", "unmarked", "affirmed", "crossed", ""
})
</script>

<template>
  <div class="cell" :class="props.cellState">
    <img :class="cellState.includes('affirmed') ? 'shown' : ''" src="@/assets/img/affirmed.png" />
    <img :class="cellState.includes('crossed') ? 'shown' : ''" src="@/assets/img/crossed.png" />
    <span v-show="props.cellNumber > 0" >{{ props.cellNumber > 0 ? cellNumber : '' }}</span>
  </div>
</template>

<style scoped>
.cell {
  display: flex;
  width: 30px;
  height: 30px;
  justify-content: center;
  align-items: center;
  background: #FFF center no-repeat;
}

.cell * {
  position: absolute;
  display: block;
  pointer-events: none;
}

.cell img {
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

.cell:hover {
  border: 1px solid #DDD;
}

.cell.crossed {
  border: none;
  /* box-shadow: 0px 0px 3px 2px var(--color-cell-crossed) inset; */
  transition: 0.2s;
  /* background: var(--color-cell-crossed); */
  /* background: var(--icon-crossed) center no-repeat; */
}

.cell.affirmed {
  border: none;
  /* box-shadow: 0px 0px 3px 2px rgba(0, 0, 0, 0.25) inset; */
  transition: 0.2s;
  /* background: var(--color-primary); */
  /* background: var(--icon-affirmed) center no-repeat; */
}

.cell.marked {
  border: none;
  box-shadow: 0px 0px 3px 2px var(--color-primary) inset;
  transition: none;
}

.cell.unmarked {
  border: none;
  box-shadow: 0px 0px 3px 2px var(--color-cell-crossed) inset;
  transition: none;
}
</style>
