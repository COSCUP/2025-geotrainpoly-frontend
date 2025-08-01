<script setup lang="ts">
import { computed, provide } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import './style.css'

const router = useRouter()
const route = useRoute()

const token = computed(() => route.query.token)

const goToBoothsList = () => {
  router.push({ path: '/booths', query: { token: token.value } })
}

const scanQRCode = () => {
  router.push({ path: '/qrcode-scanner', query: { token: token.value } })
}

const goToProfile = () => {
  router.push({ path: '/profile', query: { token: token.value } })
}

const goToGameScene = () => {
  router.push({ path: '/', query: { token: token.value } })
}

provide('token', token)
</script>

<template>
  <router-view />

  <div class="bottom-bar">
    <button class="button button-booths" @click="goToBoothsList">
       <Icon icon="tabler:building-store" class="icon" />
      <span>攤位列表</span>
    </button>

    <button class="button button-game" v-if="route.name !== 'game'" @click="goToGameScene">
       <Icon icon="ph:game-controller" class="icon" />
      <span>遊戲畫面</span>
    </button>

    <button class="button button-qrcode" v-else @click="scanQRCode">
       <Icon icon="tabler:scan" class="icon" />
      <span>掃描 QR Code</span>
    </button>

    <button class="button button-profile" @click="goToProfile">
       <Icon icon="mdi:user-circle-outline" class="icon" />
      <span>個人頁面</span>
    </button>
  </div>
</template>

<style scoped>
.bottom-bar {
  position: fixed;
  display: flex;
  bottom: 0;
  height: 70px;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  background-color: #e0ecff;
  z-index: 100;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.2);
}

.button {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0;
  padding: 0;
  transition: transform 0.2s ease-in-out, color 0.2s ease-in-out;
}

.button-game,
.button-qrcode {
  transform: translateY(-10px);
}

.button-booths:hover,
.button-profile:hover {
  transform: translateY(-2px);
  color: #007bff;
}

.button-game:hover span,
.button-qrcode:hover span {
  color: #007bff;
}

.button .icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  object-fit: contain;
}

.button-game .icon,
.button-qrcode .icon {
  width: 43px;
  height: 43px;
  background-color: #f9d33a; /* #E08C99 深粉色 #9A82B0 深紫色 #B9E3F5 淺藍色 */
  border-radius: 50%;
  padding: 5px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
}

</style>
