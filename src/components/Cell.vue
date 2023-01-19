<script setup>
</script>

<template>
  <div class="cell"></div>
</template>

<style scoped>
.cell {
  width: 30px;
  height: 30px;
  background: #F0F0F0;
}

.cell:hover {
  border: 1px solid #DDD;
}

.cell.marked {
  border: none;
  box-shadow: 0px 0px 3px 2px var(--color-primary) inset;
}

.cell.unmarked {
  border: none;
  box-shadow: 0px 0px 3px 2px var(--color-cell-crossed) inset;
}

.cell.crossed {
  border: none;
  box-shadow: 0px 0px 3px 2px var(--color-cell-crossed) inset;
  transition: 0.2s;
  background: var(--color-cell-crossed);
}

.cell.affirmed {
  border: none;
  box-shadow: 0px 0px 3px 2px rgba(0, 0, 0, 0.25) inset;
  transition: 0.2s;
  background: var(--color-primary);
}
</style>
