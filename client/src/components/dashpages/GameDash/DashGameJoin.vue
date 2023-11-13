<script setup>
import { ref } from 'vue';

let urlField = ref()

function joinGame() {
    const gameUrl = urlField.value.value
    emit("joinButtonClicked", gameUrl)
}

const emit = defineEmits(["joinButtonClicked"])
</script>

<template>
  <div class="join-dash">
    <h3>Join a game</h3>
    <p>Enter the URL of a game to join</p>
    <div class="url-container">
      <input type="text" class="url-field" ref="urlField" />
      <button ref="btnJoin" @click="joinGame">Join</button>
    </div>
  </div>
</template>

<style scoped>
.join-dash {
  height: 360px;

}
.join-dash h3 {
  font-family: "Arial Rounded";
  font-size: 32px;
  color: var(--color-primary);
}

.join-dash p {
  margin-top: 20px;
  font-size: 24px;
  color: #FFF;
}

.join-dash .url-container {
  display: flex;
  margin-top: 20px;
  user-select: text !important;
}

.join-dash .url-container .url-field {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  outline: none;
  font-size: 16px;
  user-select: all;
  color: #FFF;
  background: #00000080;
}

.join-dash .url-container .url-field:focus {
    outline: 2px solid var(--color-primary);
}


.join-dash .url-container button {
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

.join-dash .url-container button:hover {
  background: var(--color-primary-dark);
}
</style>