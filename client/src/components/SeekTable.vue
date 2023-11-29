<script setup>
import { toRaw } from "vue"

let props = defineProps({
  gameStatus: String
})
</script>

<template>
  <div class="seek-table" v-show="props.gameStatus != 'playing' && props.gameStatus != 'gameover'">
  </div>
</template>

<style scoped>
.seek-table {
  width: 400px;
  height: 100%;
  color: var(--text-color);
}
</style>