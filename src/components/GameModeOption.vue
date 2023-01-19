<script setup>
</script>

<template>
  <div class="option">
    <div class="icon"></div>
    <p class="label"><slot/></p>
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
  width: 100%;
  height: 30px;
  background: #DDD; 
}

.option p {
  margin-top: 10px;
  font-family: "Arial Rounded";
  font-size: 16px;
  text-align: center;
}
</style>