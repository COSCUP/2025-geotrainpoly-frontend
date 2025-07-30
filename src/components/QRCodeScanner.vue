<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'
import { Icon } from '@iconify/vue'
import QrcodeVue from 'qrcode.vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const qrcodeRegionId = 'html5qr-code-full-region'
const emit = defineEmits(['showMyQrCode'])
const cameraId = ref<string | null>(null)
const qrScanner = ref<Html5Qrcode | null>(null)

const config = {
  fps: 10,
  qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
    const minDimension = Math.min(viewfinderWidth, viewfinderHeight)
    const qrboxSize = Math.floor(minDimension * 0.7)
    return { width: qrboxSize, height: qrboxSize }
  },
  aspectRatio: 1,
  videoConstraints: {
    facingMode: 'environment',
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    aspectRatio: { min: 1, max: 2 },
  },
}

const showMyQrCode = ref(false)
const userToken = ref('')

const startQrScanner = async (id: string) => {
  await stopQrScanner()
  qrScanner.value = new Html5Qrcode(qrcodeRegionId)
  try {
    await qrScanner.value.start(
      config.videoConstraints,
      config,
      async (decodedText: string) => {
        console.log('QR Code 掃描成功:', decodedText)
        await stopQrScanner()
        router.push({ path: '/' })
      },
      (errorMessage: string) => {
        
      }
    )
  } catch (error) {
    console.error('啟動 QR 掃描器失敗：', error)
  }
}

const stopQrScanner = async () => {
  if (qrScanner.value && qrScanner.value.isScanning) {
    try {
      console.log('停止 QR 掃描器中...')
      await qrScanner.value.stop()

      const videoElement = document
        .getElementById(qrcodeRegionId)
        ?.querySelector('video')

      if (videoElement && videoElement.srcObject instanceof MediaStream) {
        videoElement.srcObject.getTracks().forEach((track) => track.stop())
        videoElement.srcObject = null
        console.log('MediaStream 已完全清除')
      }
    } catch (error) {
      console.error('停止 QR 掃描器失敗：', error)
    }
  }
  qrScanner.value = null
}

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const tokenFromUrl = urlParams.get('token')
  if (tokenFromUrl) {
    userToken.value = tokenFromUrl
    console.log(userToken.value)
  }

  const devices = await Html5Qrcode.getCameras()
  if (devices.length > 0) {
    cameraId.value = devices[0].id
  }

  if (route.path === '/qrcode-scanner' && cameraId.value && !showMyQrCode.value) {
    await startQrScanner(cameraId.value)
  }
})

watch(
  () => route.path,
  async (newPath) => {
    if (newPath === '/qrcode-scanner') {
      if (cameraId.value && !showMyQrCode.value) {
        await startQrScanner(cameraId.value)
      }
    } else {
      await stopQrScanner()
    }
  }
)

onUnmounted(async () => {
  await stopQrScanner()
})

const handleShowMyQrCode = async () => {
  await stopQrScanner()
  showMyQrCode.value = true
}

const closeMyQrCode = async () => {
  showMyQrCode.value = false
  if (route.path === '/qrcode-scanner' && cameraId.value) {
    await startQrScanner(cameraId.value)
  }
}
</script>

<template>
  <div class="qr-scanner-container">
    <div
      v-show="!showMyQrCode"
      :id="qrcodeRegionId"
      class="full-screen-scanner"
    >
      <div v-show="!cameraId" class="loading-message">
        相機初始化中或權限未開啟...
      </div>
    </div>

    <div v-if="showMyQrCode" class="my-qrcode-display" @click="closeMyQrCode">
      <div class="qrcode-wrapper">
        <QrcodeVue :value="userToken" :size="250" level="H" class="generated-qrcode" />
      </div>
      <p class="qrcode-instruction">點擊任意處回到掃描畫面</p>
    </div>

    <button v-show="!showMyQrCode" class="show-my-qr-button" @click="handleShowMyQrCode">
       <Icon icon="tabler:qrcode" class="qr-code-icon" />
      <span>顯示行動條碼</span>
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
  background-color: black;
}

.full-screen-scanner {
  width: 100%;
  height: 100%;
  position: relative;
}

.full-screen-scanner :deep(video) { 
  width: 100% !important;  
  height: 100% !important; 
  object-fit: cover !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  z-index: 0 !important;
}

.full-screen-scanner :deep(canvas),
.full-screen-scanner :deep(div[data-html5-qrcode-id]) {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    z-index: 1 !important;
}

.loading-message {
  color: white;
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
  position: absolute; 
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.my-qrcode-display {
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

.qrcode-wrapper {
  background-color: white;
  padding: 15px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.generated-qrcode {
  display: block;
}

.qrcode-instruction {
  margin-top: 10px;
  font-size: 0.9em;
  color: #ccc;
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
}

.qr-code-icon {
  width: 20px;
  height: 20px;
}
</style>