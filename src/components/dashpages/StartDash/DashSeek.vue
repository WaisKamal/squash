<script setup>
import config from '../../../config.json'

import BoardSizeOption from '../../BoardSizeOption.vue';
import GameModeOption from '../../GameModeOption.vue';

const props = defineProps({
  seekOptions: Object
})

// Utility function to select board size
function selectBoardSize(columns, rows) {
  props.seekOptions.boardSize = { columns, rows }
}

// Utiliy function to select game mode
function selectGameMode(mode) {
  props.seekOptions.gameMode = mode
}

// Utility function to check whether a board size option is the selected one
function isBoardSizeSelected(columns, rows) {
  return columns == props.seekOptions.boardSize.columns && rows == props.seekOptions.boardSize.rows
}

// Utility function to check whether a game mode option is the selected one
function isGameModeSelected(mode) {
  return props.seekOptions.gameMode == mode
}
</script>

<template>
  <div class="seek">
    <h3>Board size</h3>
    <div class="board-size-options">
      <BoardSizeOption
        v-for="option in config.boardSizeOptions"
        :class="isBoardSizeSelected(option.columns, option.rows) ? 'selected' : ''"
        @click="selectBoardSize(option.columns, option.rows)">
        {{ `${option.columns}x${option.rows}` }}
      </BoardSizeOption>
    </div>
    <h3>Game mode</h3>
    <div class="game-mode-options">
      <GameModeOption
        v-for="option in config.gameModeOptions"
        :class="isGameModeSelected(option.value) ? 'selected' : ''"
        @click="selectGameMode(option.value)">
        {{ option.label }}
      </GameModeOption>
    </div>
  </div>
</template>

<style scoped>
  .seek {
    height: 360px;
  }
  .seek h3 {
    font-family: "Arial Rounded";
    font-size: 32px;
    color: var(--color-primary);
  }

  .seek h3:not(:first-of-type) {
    margin-top: 10px
  }

  .seek .board-size-options, .seek .game-mode-options {
    display: flex;
    max-width: 360px;
    margin-top: 10px;
    flex-wrap: wrap;
  }
</style>