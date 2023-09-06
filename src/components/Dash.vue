<script setup>
import { reactive } from "vue"
import DashGameStatus from "./dashpages/DashGameStatus.vue";
import DashSeek from "./dashpages/DashSeek.vue";

const props = defineProps({
  boardSizeOptions: Object,
  gameModeOptions: Object,
  gameStatus: String
})

const emit = defineEmits(["seek"])

let seekOptions = reactive({
  boardSize: {
    columns: 5,
    rows: 5
  },
  gameMode: "dual-online" // { "solo", "dual-online", "dual-local" }
})
setTimeout(() => {
  console.log(seekOptions.boardSize)
}, 5000)

function seekButtonClicked() {
  emit("seek", seekOptions.boardSize)
}

// Utility function to get button text from game status
function getButtonText() {
  const statusToText = {
    "nogame": "Play",
    "playing": "Quit game",
    "gameover": "Play again"
  }
  return statusToText[props.gameStatus]
}
</script>

<template>
  <div class="dash">
    <DashSeek :seekOptions="seekOptions" v-show="props.gameStatus == 'nogame'"/>
    <DashGameStatus v-if="props.gameStatus == 'playing'"/>
    <button id="btn-play" @click="seekButtonClicked">{{ getButtonText() }}</button>
  </div>
</template>

<style scoped>
.dash {
  position: relative;
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