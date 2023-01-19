<script setup>
  const props = defineProps({
    headers: Array
  })
</script>

<template>
  <div class="column-headers">
    <div class="header" v-for="header in headers">
      <div class="item" v-for="item in header">{{ item }}</div>
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
}
</style>