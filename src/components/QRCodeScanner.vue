<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'

const qrcodeRegionId = 'html5qr-code-full-region'

const props = defineProps<{
  qrCodeSuccessCallback: (decodedText: string) => void
  // 新增一個 emit 聲明，用於通知父組件顯示行動條碼
  onShowMyQrCode?: () => void;
}>()

const emit = defineEmits(['showMyQrCode']);
const cameraId = ref<string | null>(null)
const qrScanner = ref<Html5Qrcode | null>(null)

const config = {
  fps: 10,
  qrbox: { width: 200, height: 200 },
  aspectRatio: 1,
}

onMounted(async () => {
  try {
    const devices = await Html5Qrcode.getCameras()
    if (devices && devices.length > 0) {
      cameraId.value = devices[0].id
      if (cameraId.value) {
        qrScanner.value = new Html5Qrcode(qrcodeRegionId);
        await qrScanner.value.clear();
        await qrScanner.value.start(
          { facingMode: 'environment' },
          config,
          props.qrCodeSuccessCallback,
          () => {} // onError callback
        );
      }
    }
  } catch (error) {
    console.log('permission denied')
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

watch(cameraId, async (newCameraId) => {
  if (newCameraId && !qrScanner.value?.isScanning) {
    qrScanner.value = new Html5Qrcode(qrcodeRegionId)
    try {
      await qrScanner.value.clear()
      await qrScanner.value.start(
        { facingMode: 'environment' },
        config,
        props.qrCodeSuccessCallback,
        (errorMessage: string) => {
          console.warn(`QR Scanner error: ${errorMessage}`);
        }
      )
    } catch (error) {
      console.error('Failed to start QR Scanner:', error)
    }
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
      <div v-if="!cameraId" class="loading-message">
        相機初始化中或權限未開啟...
      </div>
    </div>

    <button class="show-my-qr-button" @click="handleShowMyQrCode">
      顯示行動條碼
    </button>
  </div>
</template>

<style scoped>
.qr-scanner-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: calc(100vh - 90px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: black;
  overflow: hidden;
  z-index: 999;
}

.full-screen-scanner {
  width: 100%;
  flex-grow: 1;
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
  z-index: 1;
}

.show-my-qr-button {
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease;
  margin-top: auto;
  z-index: 1000;
}
</style>