<script setup>
  const props = defineProps({
    columnHeaders: Object
  })
</script>

<template>
  <div class="column-headers">
    <div class="header" v-for="header in columnHeaders.headers">
      <div
        class="item"
        :class="{ 'crossed': columnHeaders.crossedStatus[index] }"
        v-for="(item, index) in header">{{ item }}</div>
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
  top: 5px;
  left: 8px;
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