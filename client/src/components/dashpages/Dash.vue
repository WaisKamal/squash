<script setup>
import { reactive, toRaw } from "vue"
import DashGameStatus from "./GameDash/DashGameStatus.vue";
import DashSeek from "./StartDash/DashSeek.vue";
import DashGameWaiting from "./GameDash/DashGameWaiting.vue";
import DashGameJoin from "./GameDash/DashGameJoin.vue";

const props = defineProps({
  boardSizeOptions: Object,
  gameModeOptions: Object,
  seekOptions: Object,
  gameUrl: String,
  gameStatus: String,
  playerData: Object,
})

const emit = defineEmits(["boardSizeChanged", "gameModeChanged", "dashButtonClicked", "joinButtonClicked"])

function onBoardSizeChanged(boardSize) {
  emit("boardSizeChanged", boardSize)
}

function onGameModeChanged(gameMode) {
  emit("gameModeChanged", gameMode)
}

function seekButtonClicked() {
  emit("dashButtonClicked", props.seekOptions.boardDimensions)
}

function joinButtonClicked(gameUrl) {
  emit("joinButtonClicked", gameUrl)
}

// Utility function to get button text from game status
function getButtonText() {
  const statusToText = {
    "nogame": "Play",
    "seek": "Cancel",
    "join": "Cancel",
    "playing": "Quit game",
    "gameover": "Play again"
  }
  return statusToText[props.gameStatus]
}
</script>

<template>
  <div class="dash">
    <DashSeek
      :seekOptions="seekOptions"
      @boardSizeChanged="onBoardSizeChanged"
      @gameModeChanged="onGameModeChanged"
      v-show="gameStatus == 'nogame'"/>
    <DashGameWaiting
      :gameUrl="gameUrl"
      v-show="gameStatus == 'seek'" />
    <DashGameJoin
      :gameUrl="gameUrl"
      @joinButtonClicked="joinButtonClicked"
      v-show="gameStatus == 'join'" />
    <DashGameStatus
      v-bind="playerData"
      v-if="gameStatus == 'playing'" />
    <button id="btn-play" @click="seekButtonClicked">{{ getButtonText() }}</button>
  </div>
</template>

<style scoped>
.dash {
  position: relative;
  width: 440px;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0px 0px 50px 0px var(--color-dash-shadow);
  transition: 0.2s;
  background: var(--color-dash);
}

.dash #btn-play {
  width: 100%;
  min-width: 360px;
  padding: 15px;
  margin-top: 10px;
  border: none;
  border-radius: 5px;
  outline: none;
  font-family: "Arial Rounded";
  font-size: 24px;
  cursor: pointer;
  color: #FFF;
  background: var(--color-primary);
}

.dash #btn-play:hover {
  background: var(--color-primary-dark);
}
</style>