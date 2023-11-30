<script setup>
import { computed, toRaw } from 'vue';

const props = defineProps({
  columnHeaders: Array,
  boardState: Array
})

const headerCrossedState = computed(() => {
  let crossedState = props.columnHeaders.map(column => column.map(item => false))
  for (var c = 0; c < crossedState.length; c++) {
    let currentCount = 0
    let currentItemIndex = 0
    // Cross out items from the top of the column
    for (var r = 0; r < props.boardState.length; r++) {
      if (props.boardState[r][c] == 1) {
        currentCount++
        if (currentCount == props.columnHeaders[c][currentItemIndex]) {
          crossedState[c][currentItemIndex] = true
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
    currentItemIndex = props.columnHeaders[c].length - 1
    for (var r = props.boardState.length - 1; r >= 0; r--) {
      if (props.boardState[r][c] == 1) {
        currentCount++
        if (currentCount == props.columnHeaders[c][currentItemIndex]) {
          crossedState[c][currentItemIndex] = true
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
  <div class="column-headers">
    <div class="header" v-for="(header, headerIndex) in columnHeaders">
      <div
        class="item"
        v-for="(item, itemIndex) in header"
        :class="{ 'crossed': headerCrossedState[headerIndex][itemIndex] }">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.column-headers {
  display: grid;
  border: 1px solid transparent;
  grid-template-rows: min-content;
  grid-auto-flow: column;
}

.column-headers .header {
  display: flex;
  flex-direction: column;
  width: 30px;
  justify-content: flex-end;
}

.column-headers .header .item {
  position: relative;
  display: flex;
  width: 30px;
  height: 20px;
  justify-content: center;
  align-items: center;
  color: var(--text-color);
}

.column-headers .header .item::after {
  content: "";
  position: absolute;
  top: 0px;
  left: 13px;
  width: 4px;
  height: 20px;
  border-radius: 2px;
  transition: 0.2s;
  transform: rotate(45deg) translate(-50%, -50%) scaleY(0) translate(50%, 50%);
  background: linear-gradient(90deg, var(--bg-color) 50%, var(--text-color) 50%);
}

.column-headers .header .item.crossed::after {
  transform: rotate(45deg) translate(-50%, -50%) scaleY(1) translate(50%, 50%);
}
</style>