<script setup>
import { toRaw } from 'vue';

const props = defineProps({
  rowHeaders: Array
})
</script>

<template>
  <div class="row-headers">
    <div class="header" v-for="header in rowHeaders.headers">
      <div
        class="item"
        :class="{ 'crossed': false }"
        v-for="(item, index) in header">{{ item }}</div>
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