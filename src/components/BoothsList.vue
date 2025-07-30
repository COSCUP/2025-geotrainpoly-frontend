<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { marked } from 'marked'
import { GameData } from '../data/GameData'

const boothsData = ref([])
const activeID = ref<number | null>(null)
const renderer = new marked.Renderer()
renderer.link = function ({href, title, text}) {
  return `<a href="${href}" target="_blank">${text}</a>`
}
marked.setOptions({ renderer })

onMounted(() => {
  // const boothsDataUrl = 'https://coscup.org/2024/json/sponsor.json'
  // fetch(boothsDataUrl)
  //   .then(res => res.json())
  //   .then(json => {
  //     boothsData.value = json.reduce(
  //       (acc: any, item: any) => {
  //         acc[item.id] = item
  //         return acc
  //       }, {}
  //     )
  //   })
  //   .catch(err => {
  //     console.error('Failed to load JSON:', err)
  //   })
})

function toggleBooths(id: number) {
  activeID.value = activeID.value === id ? null : id
}

function markedIntro(intro: string) {
  const res = computed(() => marked(intro))
  return res.value
}
</script>

<template>
  <div class="booths-wrapper">
    <div class="booths-list" :style="{ 'margin-bottom': `${GameData.bottomBarHeight}px` }">
      <div
        v-for="(booths, id) in boothsData"
        :key="id"
        class="booths-item"
        @click="toggleBooths(id)"
      >
        <div class="booths-header">
          <img 
            :src="'https://coscup.org/' + boothsData[id].image" 
            :alt="boothsData[id].name['zh-TW']" class="booths-logo" />
          <span class="booths-name">{{ boothsData[id].name['zh-TW'] }}</span>
        </div>
        <transition name="fade-slide">
          <div
            v-if="activeID === id"
            class="booths-detail"
            v-html="markedIntro(booths.intro['zh-TW'])"
          >
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>


<style scoped>
.booths-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: #FBFAF2;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 0;
}

.booths-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 85%;
  width: 90%;
  overflow-y: auto;
}

.booths-item {
  border-radius: 12px;
  padding: 12px;
  background-color: white;
}

.booths-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.booths-logo {
  width: 100px;
}

.booths-name {
  font-weight: bold;
  font-size: 18px;
  color: #444;
}

.booths-detail {
  font-size: 14px;
  color: #555;
  transform-origin: top;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  max-height: 0;
  opacity: 0;
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  max-height: 500px;
  opacity: 1;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: max-height 0.5s ease, opacity 0.5s ease;
}
</style>
