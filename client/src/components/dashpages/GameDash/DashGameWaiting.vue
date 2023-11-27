<script setup>
import { ref, toRaw } from 'vue';
let props = defineProps({
  gameUrl: String
})

const emit = defineEmits(["dashButtonClicked"])

let urlField = ref()
let btnCopy = ref()

async function selectUrlAndCopy() {
  try {
    await navigator.clipboard.writeText(urlField.value.innerHTML)
    btnCopy.value.innerHTML = "Copied"
    setTimeout(() => btnCopy.value.innerHTML = "Copy", 2000)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

function dashButtonClicked() {
  emit("dashButtonClicked")
}
</script>

<template>
  <div class="wait-dash">
    <div class="dash-content">
      <h3>Waiting for opponent</h3>
      <p>The game will start when someone joins using this invite link</p>
      <div class="url-container">
        <div class="url-field" ref="urlField">{{ gameUrl }}</div>
        <button ref="btnCopy" @click="selectUrlAndCopy">Copy</button>
      </div>
    </div>
    <button class="squash-button" @click="dashButtonClicked">Cancel</button>
  </div>
</template>

<style scoped>
.wait-dash .dash-content {
  height: 360px;
}

.wait-dash h3 {
  font-family: "Arial Rounded";
  font-size: 32px;
  color: var(--color-primary);
}

.wait-dash p {
  margin-top: 20px;
  font-size: 24px;
  color: var(--text-color);
}

.wait-dash .url-container {
  display: flex;
  margin-top: 20px;
  user-select: text !important;
}

.wait-dash .url-container .url-field {
  width: 100%;
  min-width: 0px;
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
  text-wrap: nowrap;
  overflow: auto;
  user-select: all;
  color: var(--text-color);
  background: var(--color-dash-text-field);
}


.wait-dash .url-container button {
  margin-left: 10px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  outline: none;
  font-family: "Arial Rounded";
  font-size: 16px;
  cursor: pointer;
  color: #FFF;
  background: var(--color-primary);
}

.wait-dash .url-container button:hover {
  background: var(--color-primary-dark);
}
</style>