<script setup>
import { computed, toRaw } from 'vue';

const props = defineProps({
  rowHeaders: Array,
  boardState: Array
})

const headerCrossedState = computed(() => {
  let crossedState = props.rowHeaders.map(row => row.map(item => false))
  for (var r = 0; r < crossedState.length; r++) {
    let currentCount = 0
    let currentItemIndex = 0
    // Cross out items from the top of the column
    for (var c = 0; c < props.boardState[0].length; c++) {
      if (props.boardState[r][c] == 1) {
        currentCount++
        if (currentCount == props.rowHeaders[r][currentItemIndex]) {
          crossedState[r][currentItemIndex] = true
          currentItemIndex++
          currentCount = 0
        }
      } else if (props.boardState[r][c] == 2) {
        currentCount = 0
      } else {
        break
      }
    }
    // Cross out items from the bottom of the column
    currentCount = 0
    currentItemIndex = props.rowHeaders[r].length - 1
    for (var c = props.boardState[0].length - 1; c >= 0; c--) {
      if (props.boardState[r][c] == 1) {
        currentCount++
        if (currentCount == props.rowHeaders[r][currentItemIndex]) {
          crossedState[r][currentItemIndex] = true
          currentItemIndex--
          currentCount = 0
        }
      } else if (props.boardState[r][c] == 2) {
        currentCount = 0
      } else {
        break
      }
    }
  }
  return crossedState
})
</script>

<template>
  <div class="row-headers">
    <div class="header" v-for="(header, headerIndex) in rowHeaders">
      <div
        class="item"
        :class="{ 'crossed': headerCrossedState[headerIndex][itemIndex] }"
        v-for="(item, itemIndex) in header">{{ item }}</div>
    </div>
  </div>
</template>

<style scoped>
.row-headers {
  display: grid;
  grid-gap: 1px;
  border: 1px solid transparent;
}

.row-headers .header {
  display: flex;
  justify-content: flex-end;
}

.row-headers .header .item {
  position: relative;
  display: flex;
  width: 20px;
  height: 30px;
  justify-content: center;
  align-items: center;
  color: var(--text-color);
}

.row-headers .header .item::after {
  content: "";
  position: absolute;
  top: 5px;
  left: 8px;
  width: 4px;
  height: 20px;
  border-radius: 2px;
  transition: 0.2s;
  transform: rotate(45deg) translate(-50%, -50%) scaleY(0) translate(50%, 50%);
  background: linear-gradient(90deg, var(--bg-color) 50%, var(--text-color) 50%);
}

.row-headers .header .item.crossed::after {
  transform: rotate(45deg) translate(-50%, -50%) scaleY(1) translate(50%, 50%);
}
</style>