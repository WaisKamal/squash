<script setup>
let props = defineProps({
  player: String,
  progress: Number
})
console.log(props.progress)
</script>

<template>
  <div class="progress">
    <p>{{ props.player }}</p>
    <div class="progress-bar">
      <div class="handle" :style="{ left: props.progress + '%' }"></div>
    </div>
  </div>
</template>

<style scoped>
.progress {
  width: 100%;
}

.progress p {
  margin-bottom: 20px;
}

.progress .progress-bar {
  position: relative;
  width: 100%;
  height: 10px;
  margin-bottom: 30px;
  background: #DDD;
}

.progress .progress-bar .handle {
  position: absolute;
  width: 2px;
  height: 30px;
  top: -10px;
  left: 0px;
  transition: 0.25s;
  transform: translateX(-1px);
  background: var(--color-primary);
}
</style>