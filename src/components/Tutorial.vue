<script setup lang="ts">
import type Phaser from 'phaser'
import { ref, onMounted } from 'vue'

const show = ref(false)
const page = ref(0)
const total = 5
const props = defineProps<{ scene: Phaser.Scene }>()
const images = ref<HTMLImageElement[]>([])

onMounted(() => {
  const seen = localStorage.getItem("hasSeenTutorial")
  if (!seen) {
    startTutorial()
  }
})

defineExpose({
  startTutorial
})

function startTutorial() {
  page.value = 0
  show.value = true
  props.scene.input.enabled = false
  images.value = []
  for (let i = 1; i <= total; i++) {
    const img = new Image()
    img.onload = () => {
      console.log(`Tutorial image ${i} loaded.`)
    }
    img.src = `/assets/tutorial-${i}.png`
    images.value.push(img)
  }
}

function nextPage() {
  if (page.value < total - 1) {
    const nextImage = images.value[page.value + 1]
    if (nextImage && nextImage.complete) {
      page.value++
    }
  } else {
    show.value = false
    props.scene.input.enabled = true
    localStorage.setItem("hasSeenTutorial", "true")
  }
}
</script>

<template>
  <div v-if="show" class="tutorial-overlay" @click="nextPage">
    <img :src="`/assets/tutorial-${page + 1}.png`" class="tutorial-image" />
    <div class="tutorial-progress">點擊繼續（{{ page + 1 }}/{{ total }}）</div>
  </div>
</template>

<style scoped>
.tutorial-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 9999;
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.tutorial-image {
  max-width: 100%;
  max-height: 70%;
  object-fit: contain;
}

.tutorial-progress {
  color: #fff;
  font-size: 16px;
  padding: 8px 12px;
}
</style>
