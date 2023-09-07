<script setup>
import { reactive } from 'vue'
import GameProgress from './GameProgress.vue';
import Clock from './Clock.vue'

let props = defineProps({
  playerName: String,
  playerProgress: Number,
  opponentName: String,
  opponentProgress: Number
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
    <GameProgress :player="props.playerName" :progress="props.playerProgress"/>
    <GameProgress :player="props.opponentName" :progress="props.opponentProgress"/>
  </div>
</template>

<style scoped>
.game-status {
  display: flex;
  flex-direction: column;
  height: 360px;
  justify-content: center;
  align-items: center;
}
</style>