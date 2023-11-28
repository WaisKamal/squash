<script setup>
import { computed, reactive, toRaw } from 'vue';

const props = defineProps({
  isVictorious: Boolean,
  timeTaken: Number,
  cellsFilled: Object,
  cellsCrossed: Object
})

console.log(props.timeTaken)

const emit = defineEmits(["dashButtonClicked"])

let statsValues = reactive({
  timeTaken: 0,
  cellsFilled: 0,
  cellsCrossed: 0
})

let timeTakenIncrement = Math.floor(
  Math.max(1,
    Math.min(9, props.timeTaken
      / Math.max(props.cellsFilled.filled, props.cellsCrossed.crossed)
    )
  )
)
console.log(timeTakenIncrement)
const timeTakenInt = setInterval(() => {
  if (statsValues.timeTaken >= props.timeTaken) {
    clearInterval(timeTakenInt)
  }
  statsValues.timeTaken = Math.min(statsValues.timeTaken + timeTakenIncrement, props.timeTaken)
}, 50)

const cellsFilledInt = setInterval(() => {
  if (statsValues.cellsFilled >= props.cellsFilled.filled) {
    clearInterval(cellsFilledInt)
  }
  statsValues.cellsFilled = Math.min(statsValues.cellsFilled + 1, props.cellsFilled.filled)
}, 50)

const cellsCrossedInt = setInterval(() => {
  if (statsValues.cellsCrossed >= props.cellsCrossed.crossed) {
    clearInterval(cellsCrossedInt)
  }
  statsValues.cellsCrossed = Math.min(statsValues.cellsCrossed + 1, props.cellsCrossed.crossed)
}, 10)

const timeTakenText = computed(() => {
  const minutes = Math.floor(statsValues.timeTaken / 60).toString().padStart(2, "0")
  const seconds = Number(statsValues.timeTaken % 60).toString().padStart(2, "0")
  return `${minutes}:${seconds}`
})

const cellsFilledText = computed(() => {  
  return `${statsValues.cellsFilled}/${props.cellsFilled.total}`
})

const cellsCrossedText = computed(() => {
  return `${statsValues.cellsCrossed}/${props.cellsCrossed.total}`
})

function dashButtonClicked() {
  emit("dashButtonClicked")
}

console.log(props.isVictorious)
</script>

<template>
  <div class="game-over-dash">
    <div class="dash-content">
      <h1>{{ isVictorious ? "You win!" : "You lose" }}</h1>
      <div class="stats">
        <div class="item">
          <h3 class="value">{{ timeTakenText }}</h3>
          <p class="name">time taken</p>
        </div>
        <div class="item">
          <h3 class="value">{{ cellsFilledText }}</h3>
          <p class="name">cells filled</p>
        </div>
        <div class="item">
          <h3 class="value">{{ cellsCrossedText }}</h3>
          <p class="name">cells crossed</p>
        </div>
      </div>
    </div>
    <button class="squash-button" @click="dashButtonClicked">Play again</button>
  </div>
</template>

<style scoped>
.game-over-dash .dash-content {
  height: 360px;
}

.game-over-dash .dash-content h1 {
  font-family: "Arial Rounded";
  font-size: 64px;
  text-align: center;
  color: var(--color-primary);
}

.game-over-dash .dash-content .stats {
  display: flex;
  gap: 40px;
  margin-top: 40px;
  flex-wrap: wrap;
  justify-content: center;
}

.game-over-dash .dash-content .stats .item {
}

.game-over-dash .stats .item .value {
  font-size: 36px;
  text-align: center;
  color: var(--text-color);
}

.game-over-dash .stats .item .name {
  font-size: 16px;
  text-align: center;
  color: var(--text-color);
}
</style>