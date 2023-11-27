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

function dashButtonClicked() {
  emit("dashButtonClicked", props.seekOptions.boardDimensions)
}

function joinButtonClicked(gameUrl) {
  emit("joinButtonClicked", gameUrl)
}
</script>

<template>
  <div class="dash">
    <DashSeek
      :seekOptions="seekOptions"
      @boardSizeChanged="onBoardSizeChanged"
      @gameModeChanged="onGameModeChanged"
      @dashButtonClicked="dashButtonClicked"
      v-show="gameStatus == 'nogame'"/>
    <DashGameWaiting
      :gameUrl="gameUrl"
      @dashButtonClicked="dashButtonClicked"
      v-show="gameStatus == 'seek'" />
    <DashGameJoin
      :gameUrl="gameUrl"
      @joinButtonClicked="joinButtonClicked"
      @dashButtonClicked="dashButtonClicked"
      v-show="gameStatus == 'join'" />
    <DashGameStatus
      v-bind="playerData"
      @dashButtonClicked="dashButtonClicked"
      v-if="gameStatus == 'playing'" />
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
</style>