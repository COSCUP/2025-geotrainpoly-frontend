import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import PhaserGame from '../components/PhaserGame.vue'
import BoothsList from '../components/BoothsList.vue'
import QRCodeScanner from '../components/QRCodeScanner.vue'
import MyProfile from '../components/MyProfile.vue'

const handleQrCodeScanned = (decodedText: string) => {
  console.log('QR Code 掃描成功:', decodedText)
  router.push({ path: '/'});
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'game',
    component: PhaserGame
  },
  {
    path: '/booths',
    name: 'booths',
    component: BoothsList
  },
  {
    path: '/qrcode-scanner',
    name: 'qrcode-scanner',
    component: QRCodeScanner,
    props: (route) => ({
      qrCodeSuccessCallback: handleQrCodeScanned,
    }),
  },
  {
    path: '/profile',
    name: 'profile',
    component: MyProfile
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router