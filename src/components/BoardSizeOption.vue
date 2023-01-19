<script setup>
</script>

<template>
  <div class="option">
    <p><slot /></p>
  </div>
</template>

<style scoped>
.option {
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

.option p {
  font-family: "Arial Rounded";
  font-size: 24px;
  line-height: 1;
  text-align: center
}
</style>