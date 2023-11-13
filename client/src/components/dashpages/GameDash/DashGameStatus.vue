<script setup>
import { reactive } from 'vue'
import GameProgress from './GameProgress.vue';
import Clock from './Clock.vue'

let props = defineProps({
  playerName: String,         // The player's name
  playerProgress: Object,     // {
                              //   filledCells: the percentage of filled cells marked
                              //   emptyCells: the percentage of empty cells marked
                              // }
  opponentName: String,       // Similar to playerName
  opponentProgress: Object    // Similar to opponentProgress
})

let time = reactive({
  value: 0
})
setInterval(() => {
  time.value++
}, 1000)
</script>

<template>
  <div class="game-status">
    <Clock :time="time.value" />
    <GameProgress :playerName="props.playerName" :progress="props.playerProgress"/>
    <GameProgress :playerName="props.opponentName" :progress="props.opponentProgress"/>
  </div>
</template>

<style scoped>
.game-status {
  display: flex;
  flex-direction: column;
  height: 360px;
  align-items: center;
}
</style>