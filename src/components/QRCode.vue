<script setup lang="ts">
import { QrcodeStream } from 'vue-qrcode-reader'
import QrcodeVue from 'qrcode.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { EventBus } from '../game/EventBus'

const route = useRoute()
const router = useRouter()
const token = computed(() => route.query.token)
const showMyQrCode = ref(true)

const onDetect = (decodedText: string) => {
  const boothToken = decodedText[0].rawValue
  EventBus.emit('add-new-hextile', boothToken)
  router.push({ path: '/', query: { token: token.value } })
}
</script>

<template>
  <div class="qr-scanner-container">
    <div v-if="showMyQrCode" class="my-qr-code-container">
      <div class="my-qr-code">
        <qrcode-vue :value="token" :size="250" />
      </div>
    </div>

    <div v-else class="qr-code-scanner">
      <qrcode-stream @detect="onDetect"></qrcode-stream>
    </div>

    <button class="show-my-qr-button" @click="showMyQrCode = !showMyQrCode">
      <Icon :icon="showMyQrCode ? 'tabler:scan' : 'tabler:qrcode'" class="button-icon"></Icon>
      <span>{{ showMyQrCode ? '掃描 QR Code' : '顯示 QR Code' }}</span>
    </button>
  </div>
</template>

<style scoped>
.qr-scanner-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  bottom: 70px;
  z-index: 100;
  overflow: hidden;
  background-color: #111;
}

.qr-scanner-container:after {
  position: absolute;
  content: '';
  display: black;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  width: 90vw;
  aspect-ratio: 1 / 1;
  z-index: 100;
  border: 10px solid #f30000;
}

.qr-code-scanner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
}

.my-qr-code-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 101;
  color: white;
  text-align: center;
}

.my-qr-code {
  padding: 20px;
  background: #fff;
  border-radius: 10px;
}

.show-my-qr-button {
  background-color: gray;
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 20px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease;
  position: absolute; 
  bottom: 30px;
  left: 50%; 
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1em;
  gap: 5px;
  -webkit-tap-highlight-color: transparent;
}

.button-icon {
  width: 20px;
  height: 20px;
}
</style>
