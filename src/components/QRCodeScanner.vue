<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'
import { Icon } from '@iconify/vue'

const qrcodeRegionId = 'html5qr-code-full-region'

const props = defineProps<{
  qrCodeSuccessCallback: (decodedText: string) => void
}>()

const emit = defineEmits(['showMyQrCode']);
const cameraId = ref<string | null>(null)
const qrScanner = ref<Html5Qrcode | null>(null)

const config = {
  fps: 10,
  qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
    const minDimension = Math.min(viewfinderWidth, viewfinderHeight);
    const qrboxSize = Math.floor(minDimension * 0.7); 
    return { width: qrboxSize, height: qrboxSize };
  },
  aspectRatio: 1, 
  videoConstraints: {
    facingMode: 'environment', 
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    aspectRatio: { min: 1, max: 2 } 
  }
}

onMounted(async () => {
  try {
    const devices = await Html5Qrcode.getCameras()
    if (devices && devices.length > 0) {
      cameraId.value = devices[0].id
      if (cameraId.value) {
        startQrScanner(cameraId.value); 
      }
    } else {
      console.log('未找到任何相機設備。');
    }
  } catch (error) {
    console.log('permission denied or camera error:', error);
  }
})

onUnmounted(async () => {
  if (qrScanner.value && qrScanner.value.isScanning) {
    try {
      await qrScanner.value.stop()
      console.log('QR 掃描器已停止')
    } catch (error) {
      console.error('QR 掃描器失敗：', error)
    }
  }
})

async function startQrScanner(id: string) {
  if (qrScanner.value && qrScanner.value.isScanning) {
    await qrScanner.value.stop().catch(err => console.error("Failed to stop previous scanner:", err));
  }
  qrScanner.value = new Html5Qrcode(qrcodeRegionId)
  try {
    await qrScanner.value.start(
      config.videoConstraints, 
      config,
      props.qrCodeSuccessCallback,
      (errorMessage: string) => {
        console.warn(`QR Scanner error: ${errorMessage}`);
      }
    )
    console.log("QR Scanner started successfully.");
  } catch (error) {
    console.error('Failed to start QR Scanner:', error)
  }
}

watch(cameraId, async (newCameraId) => {
  if (newCameraId) {
    startQrScanner(newCameraId);
  }
})

const handleShowMyQrCode = () => {
  if (qrScanner.value && qrScanner.value.isScanning) {
    qrScanner.value.stop().catch(err => console.error("Failed to stop scanner before showing my QR code:", err));
  }
  emit('showMyQrCode');
  alert("按下qrcode按鈕");
}
</script>

<template>
  <div class="qr-scanner-container">
    <div
      :id="qrcodeRegionId"
      class="full-screen-scanner"
    >
      <div v-show="!cameraId" class="loading-message">
        相機初始化中或權限未開啟...
      </div>
    </div>

    <button class="show-my-qr-button" @click="handleShowMyQrCode">
       <Icon icon="tabler:qrcode" class="qr-code-icon" /> <span>顯示行動條碼</span>
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

.show-my-qr-button {
  background-color: rgba(0, 0, 0, 0.4);
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
  gap: 5px;
}

.qr-code-icon {
  width: 20px;
  height: 20px;
}
</style>