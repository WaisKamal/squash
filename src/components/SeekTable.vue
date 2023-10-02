<script setup>
import { toRaw } from "vue"

let props = defineProps({
  gameStatus: String,
  seekRequests: Array
})
</script>

<template>
  <div class="seek-table" v-show="props.gameStatus == 'nogame'">
    <table border="0">
      <thead>
        <tr>
          <th>Player</th>
          <th>Board Size</th>
        </tr>
        <tr v-for="request in props.seekRequests">
          <td>{{ request.playerName }} ({{ request.rating }})</td>
          <td>{{ request.boardDimensions.columns }}x{{ request.boardDimensions.rows }}</td>
        </tr>
      </thead>
    </table>
  </div>
</template>

<style scoped>
.seek-table {
  height: 100%;
  color: var(--text-color);
}

.seek-table table {
  width: 400px;
  border-collapse: collapse;
}

.seek-table tr {
  border-bottom: 1px solid var(--border-color);
}

.seek-table tr:not(:first-child):hover {
  background: var(--border-color);
}

.seek-table td, .seek-table th {
  padding: 6px 10px;
  text-align: left;
}
</style>