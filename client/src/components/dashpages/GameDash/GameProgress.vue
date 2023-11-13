<script setup>
import { computed, toRaw } from "vue"

let props = defineProps({
  playerName: String,
  progress: Object
})

let progressBarsData = computed(() => {
  let totalCellsCount = props.progress.filledCells.total + props.progress.emptyCells.total
  return {
    filledCellsProgressBarWidth: 100 * props.progress.filledCells.total / totalCellsCount,
    emptyCellsProgressBarWidth: 100 * props.progress.emptyCells.total / totalCellsCount,
    filledCellsProgress: 100 * props.progress.filledCells.marked / props.progress.filledCells.total,
    emptyCellsProgress: 100 * props.progress.emptyCells.marked / props.progress.emptyCells.total
  }
})
</script>

<template>
  <div class="progress">
    <p>{{ props.playerName }}</p>
    <div class="progress-bar-wrapper">
      <div
        class="progress-bar filled-cells"
        :style="{ width: progressBarsData.filledCellsProgressBarWidth + '%' }">
        <div class="fluid" :style="{ width: progressBarsData.filledCellsProgress + '%' }"></div>
        <div class="handle" :style="{ left: progressBarsData.filledCellsProgress + '%' }"></div>
        <div class="label"
          style="transform: translateX(-50%);"
          :style="{ left: progressBarsData.filledCellsProgress + '%' }">
          {{ progressBarsData.filledCellsProgress.toFixed(2) + '% done' }}
        </div>
      </div>
      <div
        class="progress-bar empty-cells"
        :style="{ width: progressBarsData.emptyCellsProgressBarWidth + '%' }">
        <div class="fluid" :style="{ width: progressBarsData.emptyCellsProgress + '%' }"></div>
        <div class="handle" :style="{ right: progressBarsData.emptyCellsProgress + '%' }"></div>
        <div class="label"
          style="transform: translateX(50%);"
          :style="{ right: progressBarsData.emptyCellsProgress + '%' }">
          {{ progressBarsData.emptyCellsProgress.toFixed(2) + '% done' }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.progress {
  width: 100%;
}

.progress p {
  margin-bottom: 20px;
  font-weight: bold;
  color: var(--text-color);
}

.progress .progress-bar-wrapper {
  display: flex;
  margin-bottom: 30px;
}

.progress .progress-bar {
  position: relative;
  width: 100%;
  height: 10px;
}

.progress .progress-bar.filled-cells {
  background: var(--color-primary-o25);
}

.progress .progress-bar.empty-cells {
  background: var(--color-cell-crossed-o25);
}

.progress .progress-bar .fluid {
  position: absolute;
  height: 100%;
  transition: 0.25s;
}

.progress .progress-bar.filled-cells .fluid {
  left: 0px;
  background: var(--color-primary);
}

.progress .progress-bar.empty-cells .fluid {
  right: 0px;
  background: var(--color-cell-crossed);
}

.progress .progress-bar .handle {
  position: absolute;
  width: 2px;
  height: 30px;
  top: -10px;
  transition: 0.25s;
}

.progress .progress-bar.filled-cells .handle {
  left: 0px;
  transform: translateX(-1px);
  background: var(--color-primary);
}

.progress .progress-bar.empty-cells .handle {
  right: 0px;
  transform: translateX(1px);
  background: var(--color-cell-crossed);
}

.progress .progress-bar .label {
  position: absolute;
  top: -42px;
  padding: 5px;
  border-radius: 3px;
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;
  transition: 0.1s;
  pointer-events: none;
  opacity: 0;
  color: #FFF;
  background: #111;
}

.progress .progress-bar:hover .label {
  top: -47px;
  opacity: 1;
  pointer-events: initial;
}

.progress .progress-bar .label::after {
  content: "";
  border: 10px solid transparent;
  border-top: 10px solid #111;
  position: absolute;
  bottom: -20px;
  left: calc(50% - 10px);
}

</style>