<template>
  <ion-page class="mario-bg">
    <ion-content fullscreen>
      <div class="game-ui">
        <div class="score">Score: <span id="score">0</span></div>
        <div class="lives">Lives: <span id="lives">3</span></div>
        <div class="date">Date: <span id="game-date"></span></div>
      </div>
      <canvas id="gameCanvas" width="1900" height="900"></canvas>
      <div class="touch-controls">
        <ion-button id="leftButton" shape="round" color="primary">◀</ion-button>
        <ion-button id="jumpButton" shape="round" color="success">⏫</ion-button>
        <ion-button id="rightButton" shape="round" color="primary">▶</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonButton } from '@ionic/vue';
</script>

<style scoped>
.mario-bg {
  background: linear-gradient(to bottom, #7ecfff 0%, #b3e6ff 60%, #aee9a7 100%);
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}
.game-ui {
  position: absolute;
  top: 2vw;
  left: 2vw;
  color: #fff;
  font-size: 2.5vw;
  text-shadow: 2px 2px 8px rgba(0,0,0,0.7);
  background: rgba(0,0,0,0.25);
  border-radius: 1vw;
  padding: 1vw 2vw;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.touch-controls {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100vw;
  display: flex;
  justify-content: center;
  gap: 7vw;
  z-index: 10;
  padding-bottom: 2vw;
  background: linear-gradient(to top, rgba(200,255,200,0.7) 60%, rgba(255,255,255,0));
}
canvas#gameCanvas {
  display: block;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: transparent;
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  aspect-ratio: 19/9;
}
</style>
