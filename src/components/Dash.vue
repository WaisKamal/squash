<script setup>
import { reactive } from "vue"
import BoardSizeOption from './BoardSizeOption.vue';
import GameModeOption from './GameModeOption.vue';

const props = defineProps({
  boardSizeOptions: Object,
  gameModeOptions: Object
})

const emit = defineEmits(["seek"])

let seekOptions = reactive({
  boardSize: {
    width: 5,
    height: 5
  },
  gameMode: "dual-online" // { "solo", "dual-online", "dual-local" }
})

function seekButtonClicked() {
  emit("seek", seekOptions.boardSize)
}

// Utility function to select board size
function selectBoardSize(width, height) {
  seekOptions.boardSize = { width, height }
}

// Utiliy function to select game mode
function selectGameMode(mode) {
  seekOptions.gameMode = mode
}

// Utility function to check whether a board size option is the selected one
function isBoardSizeSelected(width, height) {
  return width == seekOptions.boardSize.width && height == seekOptions.boardSize.height
}

// Utility function to check whether a game mode option is the selected one
function isGameModeSelected(mode) {
  return seekOptions.gameMode == mode
}
</script>

<template>
  <div class="dash">
    <h3>Board size</h3>
    <div class="board-size-options">
      <BoardSizeOption
        v-for="option in props.boardSizeOptions"
        :class="isBoardSizeSelected(option.width, option.height) ? 'selected' : ''"
        @click="selectBoardSize(option.width, option.height)">
        {{ `${option.width}x${option.height}` }}
      </BoardSizeOption>
    </div>
    <h3>Game mode</h3>
    <div class="game-mode-options">
      <GameModeOption
        v-for="option in props.gameModeOptions"
        :class="isGameModeSelected(option.value) ? 'selected' : ''"
        @click="selectGameMode(option.value)">
        {{ option.label }}
      </GameModeOption>
    </div>
    <button id="btn-play" @click="seekButtonClicked">Play</button>
  </div>
</template>

<style scoped>
.dash {
  position: relative;
}

.dash h3 {
  font-family: "Arial Rounded";
  font-size: 32px;
  color: var(--color-primary);
}

.dash h3:not(:first-of-type) {
  margin-top: 20px
}

.dash .board-size-options, .game-mode-options {
  display: flex;
  max-width: 360px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.dash #btn-play {
  width: 100%;
  padding: 15px;
  margin-top: 20px;
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