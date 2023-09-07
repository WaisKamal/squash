<script setup>
import { reactive, computed } from 'vue'

let props = defineProps({
  time: Number
})

let clock = computed(() => {
  return {
    seconds: props.time % 60,
    minutes: Math.floor(props.time / 60) % 60,
    hours: Math.floor(props.time / 3600) % 24,
    days: Math.floor(props.time / 86400)
  }
})
</script>
<template>
  <h3 class="clock">
    <span id="days" v-if="clock.days">{{ clock.days }}</span>
    <span v-if="clock.days">:</span>
    <span id="hours" v-if="clock.hours || clock.days">{{ clock.hours.toString().padStart(2, 0) }}</span>
    <span v-if="clock.hours || clock.days">:</span>
    <span id="minutes">{{ clock.minutes.toString().padStart(2, 0) }}</span>
    <span>:</span>
    <span id="seconds">{{ clock.seconds.toString().padStart(2, 0) }}</span>
  </h3>
</template>

<style scoped>
.clock {
  margin-bottom: 20px;
  font-family: "Arial Rounded";
  font-size: 64px;
  text-align: center;
  color: var(--color-primary);
}
</style>