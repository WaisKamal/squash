<script setup>
let props = defineProps({
  iconName: String,
  label: String
})
</script>

<template>
  <div class="option">
    <div class="icon">
      <img :src="`/src/assets/img/${iconName}.png`" />
    </div>
    <p class="label">{{ label }}</p>
  </div>
</template>

<style scoped>
.option {
  position: relative;
  width: 100px;
  padding: 10px;
  border: 3px solid transparent;
  border-radius: 10px;
  margin-right: 20px;
  margin-bottom: 20px;
  cursor: pointer;
}

.option.selected {
  border-color: var(--color-primary);
}

.option .icon {
  position: relative;
  display: flex;
  width: 100%;
  height: 30px;
  justify-content: center;
  align-items: center;
}

.option .icon img {
  display: block;
  height: 100%;
}

.option p {
  margin-top: 10px;
  font-family: "Arial Rounded";
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: var(--text-color);
}
</style>