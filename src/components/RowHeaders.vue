<script setup>
  const props = defineProps({
    headers: Array
  })
</script>

<template>
  <div class="row-headers">
    <div class="header" v-for="header in headers">
      <div class="item" v-for="item in header">{{ item }}</div>
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
  display: flex;
  width: 20px;
  height: 30px;
  justify-content: center;
  align-items: center;
}
</style>