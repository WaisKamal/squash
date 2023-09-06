<script setup>
import { reactive, computed } from "vue"

let time = reactive({
  value: 0
})
setInterval(() => {
  time.value++
}, 1000)
let clock = computed(() => {
  return {
    seconds: time.value % 60,
    minutes: Math.floor(time.value / 60) % 60,
    hours: Math.floor(time.value / 3600) % 24,
    days: Math.floor(time.value / 86400)
  }
})
</script>

<template>
  <div class="game-status">
    <h3 class="clock">
      <span id="days" v-if="clock.days">{{ clock.days }}</span>
      <span v-if="clock.days">:</span>
      <span id="hours" v-if="clock.hours || clock.days">{{ clock.hours.toString().padStart(2, 0) }}</span>
      <span v-if="clock.hours || clock.days">:</span>
      <span id="minutes">{{ clock.minutes.toString().padStart(2, 0) }}</span>
      <span>:</span>
      <span id="seconds">{{ clock.seconds.toString().padStart(2, 0) }}</span>
    </h3>
  </div>
</template>

<style scoped>
  .game-status {
    display: flex;
    height: 360px;
    justify-content: center;
    align-items: center;
  }
  .clock {
    font-family: "Arial Rounded";
    font-size: 64px;
    text-align: center;
    color: var(--color-primary);
  }
</style>