<script setup>
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
          <td>{{ request.player }} ({{ request.rating }})</td>
          <td>{{ request.boardSize.width }}x{{ request.boardSize.height }}</td>
        </tr>
      </thead>
    </table>
  </div>
</template>

<style scoped>
.seek-table {
  height: 100%;
}

.seek-table table {
  width: 400px;
  border-collapse: collapse;
}

.seek-table tr {
  border-bottom: 1px solid #DDD;
}

.seek-table tr:not(:first-child):hover {
  background: #F9F9F9;
}

.seek-table td, .seek-table th {
  padding: 6px 10px;
  text-align: left;
}

.seek-table table tr:first-child {
  
}
</style>