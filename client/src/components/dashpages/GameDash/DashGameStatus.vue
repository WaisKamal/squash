<script setup>
import { reactive } from 'vue'
import GameProgress from './GameProgress.vue';
import Clock from './Clock.vue'

let props = defineProps({
  playerName: String,            // The player's name
  playerIsConnected: Boolean,    // Player's connection status
  playerProgress: Object,        // {
                                 //   filledCells: the percentage of filled cells marked
                                 //   emptyCells: the percentage of empty cells marked
                                 // }
  opponentName: String,          // Similar to playerName
  opponentIsConnected: Boolean,  // Similar to playerIsConnected
  opponentProgress: Object,      // Similar to playerProgress
  gameTime: Number,              // The game time in second
})

const emit = defineEmits(["startTimer", "stopTimer", "dashButtonClicked",])

// Start timer when game status dash is mounted
emit("startTimer")

function dashButtonClicked() {
  emit("dashButtonClicked")
}
</script>

<template>
  <div class="game-status">
    <div class="dash-content">
      <Clock :time="gameTime" />
      <GameProgress :playerName="props.playerName" :progress="props.playerProgress"/>
      <GameProgress :playerName="props.opponentName" :progress="props.opponentProgress"/>
      <div
        class="notification"
        v-show="!playerIsConnected || !opponentIsConnected">
        {{ !playerIsConnected ? 'You' : 'Your opponent' }} went offline. Game forfiets in 00:30
      </div>
    </div>
    <button class="squash-button" @click="dashButtonClicked">Quit game</button>
  </div>
</template>

<style scoped>
.game-status {
}

.game-status .dash-content {
  display: flex;
  height: 360px;
  flex-direction: column;
  align-items: center;
}

.game-status .notification {
  width: 100%;
  padding: 5px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: bold;
  color: var(--color-dash-warning-text);
  background: var(--color-dash-warning);
}
</style>