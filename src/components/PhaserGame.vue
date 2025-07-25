<script setup lang="ts">
import type Phaser from 'phaser'
import { onMounted, onUnmounted, ref, watch, computed } from 'vue'
import { marked } from 'marked'
import { EventBus } from '../game/EventBus'
import { GameData } from '../data/GameData.ts'
import StartGame from '../game/main'
import { Icon } from '@iconify/vue'
import Danmaku from './Danmaku.vue'
import { get_booths } from '../api/get_booths.ts'

const emit = defineEmits(['current-active-scene'])
// Save the current scene instance
const scene = ref()
const game = ref()
const showPopup = ref(false)
const popupData = ref<{ type: string, ID: string } | null>(null)
const boothsData = ref()
const comments = ref()
const newMessage = ref('')
const renderer = new marked.Renderer()
renderer.link = function ({href, title, text}) {
  return `<a href="${href}" target="_blank">${text}</a>`
}
marked.setOptions({ renderer })

onMounted(async () => {
  game.value = await StartGame('game-container')

  boothsData.value = await get_booths()

  EventBus.on('current-scene-ready', (sceneInstance: Phaser.Scene) => {
    emit('current-active-scene', sceneInstance)

    scene.value = sceneInstance
  })

  EventBus.on('tile-clicked', (data:{ type: string, ID: string }) => {
    showPopup.value = true
    popupData.value = data
  })
})

onUnmounted(() => {
  if (game.value) {
    game.value.destroy(true)
    game.value = null
  }
})

defineExpose({ scene, game })

function closePopup() {
  showPopup.value = false
  GameData.popupOpen = false
  comments.value = []
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('zh-TW', { month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: 'h23'})
}

function addComment() {
  comments.value.push({
    id: comments.value.length + 1,
    user: 'TC',
    title: '新手小啄',
    message: newMessage.value,
    timestamp: new Date().toISOString(),
    isLiked: false,
    likes: 0
  })
  newMessage.value = ''
}

function markedIntro(intro: string) {
  const res = computed(() => marked(intro))
  return res.value
}

const topComments = computed(() =>
  comments.value
    .slice()
    .sort((a: any, b: any) => b.likes - a.likes)
    .slice(0, 3)
)

const isButtonDisabled = computed(() => {
  return newMessage.value.trim() === ''
})

function toggleLike(id: number) {
  const index = comments.value.findIndex((c: any) => c.id === id)
  if (comments.value[index].isLiked) {
    comments.value[index].isLiked = false
    comments.value[index].likes--
  } else {
    comments.value[index].isLiked = true
    comments.value[index].likes++

    comments.value[index].animate = true
    setTimeout(() => {
      comments.value[index].animate = false
    }, 300)
  }
}

watch([showPopup, popupData], async ([isOpen, data]) => {
  if (isOpen && data?.type === 'venue') {
    comments.value = [
      {
        "id": 1,
        "user": "Alice",
        "title": "新手小啄",
        "message": "這個場地超棒，氣氛很好！",
        "timestamp": "2025-06-27T10:24:00+08:00",
        "isLiked": false,
        "likes": 1200
      },
      {
        "id": 2,
        "user": "Bob",
        "title": "意見領袖",
        "message": "昨天參加的活動非常精彩，謝謝主辦單位。",
        "timestamp": "2025-06-27T11:12:34+08:00",
        "isLiked": true,
        "likes": 900
      },
      {
        "id": 3,
        "user": "Cindy",
        "title": "有點小可愛",
        "message": "請問這裡有提供素食餐點嗎？",
        "timestamp": "2025-06-27T11:45:10+08:00",
        "isLiked": false,
        "likes": 1500
      },
      {
        "id": 4,
        "user": "Daniel",
        "title": "人氣新星",
        "message": "希望下次活動可以有更多互動環節。",
        "timestamp": "2025-06-27T12:01:50+08:00",
        "isLiked": false,
        "likes": 600
      },
      {
        "id": 5,
        "user": "Emily",
        "title": "魅力無法擋",
        "message": "場地有點小，不過整體很溫馨！",
        "timestamp": "2025-06-27T12:35:22+08:00",
        "isLiked": false,
        "likes": 2509
      },
      {
        "id": 6,
        "user": "Frank",
        "title": "愛心發電機",
        "message": "活動真的很用心，期待下次再參加！",
        "timestamp": "2025-06-27T13:05:00+08:00",
        "isLiked": true,
        "likes": 2
      },
      {
        "id": 7,
        "user": "Grace",
        "title": "新手小啄",
        "message": "現場氣氛很好，主持人也超有趣。",
        "timestamp": "2025-06-27T13:12:35+08:00",
        "isLiked": false,
        "likes": 6
      },
      {
        "id": 8,
        "user": "Henry",
        "title": "意見領袖",
        "message": "覺得空間稍微擁擠，但整體體驗不錯。",
        "timestamp": "2025-06-27T13:23:19+08:00",
        "isLiked": false,
        "likes": 4
      },
      {
        "id": 9,
        "user": "Irene",
        "title": "有點小可愛",
        "message": "可以考慮加入音樂表演會更棒！",
        "timestamp": "2025-06-27T13:41:02+08:00",
        "isLiked": false,
        "likes": 27
      },
      {
        "id": 10,
        "user": "Jack",
        "title": "人氣新星",
        "message": "我最喜歡DIY區域，小朋友玩得很開心。",
        "timestamp": "2025-06-27T14:00:00+08:00",
        "isLiked": false,
        "likes": 36
      },
      {
        "id": 11,
        "user": "Kelly",
        "title": "魅力無法擋",
        "message": "希望之後有更多互動攤位～",
        "timestamp": "2025-06-27T14:05:43+08:00",
        "isLiked": false,
        "likes": 54
      },
      {
        "id": 12,
        "user": "Leo",
        "title": "愛心發電機",
        "message": "美食區真的很豐富！吃得超滿足！",
        "timestamp": "2025-06-27T14:21:10+08:00",
        "isLiked": false,
        "likes": 24
      },
      {
        "id": 13,
        "user": "Mia",
        "title": "真心不騙",
        "message": "第一次來這個場地，感覺超棒！",
        "timestamp": "2025-06-27T14:35:47+08:00",
        "isLiked": false,
        "likes": 123
      },
      {
        "id": 14,
        "user": "Nate",
        "title": "新手小啄",
        "message": "排隊動線可以再優化一下。",
        "timestamp": "2025-06-27T14:50:00+08:00",
        "isLiked": false,
        "likes": 5
      },
      {
        "id": 15,
        "user": "Olivia",
        "title": "愛心發電機",
        "message": "主題佈置好漂亮，拍了很多照片！",
        "timestamp": "2025-06-27T15:00:12+08:00",
        "isLiked": true,
        "likes": 100
      }
    ]
  }
})
</script>

<template>
  <div id="game-container" :style="{ bottom: `${GameData.bottomBarHeight}px` }" />
  <div class="popup-overlay" id="popup" v-if="showPopup">
    <div class="popup-content">
      <button class="popup-close" id="popupClose" @click="closePopup()">x</button>
      <div v-if="popupData?.type === 'base'">
        <img
          alt="COSCUP x RubyConf Taiwan 2025 banner"
          src="/assets/banner-mobile.png"
        >
      </div>
      <div v-else-if="popupData?.type === 'booths'" class="Booths">
        <h2>{{ boothsData['1'].name }}</h2> <!-- TODO: replace '1' with ID-->
        <img
          :alt="boothsData['1'].name" 
          :src="boothsData['1'].logo"
        > <!-- TODO: replace '1' with ID-->
        <div class="booths-content" v-html="markedIntro(boothsData['1'].description )"></div> <!-- TODO: replace '1' with ID-->
      </div>
      <div v-else-if="popupData?.type === 'venue'" class="Venue">
        <h2>{{ popupData?.ID }}</h2>
        <div class="comment-list">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <div class="comment-content">
              <div class="comment-header">
                <span class="comment-user">{{ comment.user + "．" + comment.title }}</span>
                <span class="comment-time">{{ formatTime(comment.timestamp) }}</span>
              </div>
              <p class="comment-message">{{ comment.message }}</p>
            </div>
            <div class="comment-likes">
              <Icon v-if="comment.isLiked" icon="mdi:heart" width="24" height="24"  style="color: #f00" @click="toggleLike(comment.id)" :class="{ 'like-icon': true, 'animate': comment.animate }" />
              <Icon v-else icon="mdi:heart-outline" width="24" height="24" @click="toggleLike(comment.id)" :class="{ 'like-icon': true, 'animate': comment.animate }" />
              <p> {{ comment.likes }} </p>
            </div>
          </div>
        </div>
        <div class="comment-form">
          <textarea v-model="newMessage" rows="3" placeholder="寫下你的留言...（上限 30 個字）" maxlength="30"></textarea>
          <button @click="addComment" :disabled="isButtonDisabled">送出留言</button>
        </div>
      </div>
    </div>
  </div>
  <Danmaku :comments="topComments" v-if="popupData?.type === 'venue'"/>
</template>

<style scoped>
#game-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 0;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(4px);
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.popup-content {
  position: relative;
  background-color: white;
  color: black;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  max-width: 70%;
  text-align: center;
}

.popup-close {
  position: absolute;
  top: -12px;
  right: -12px;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background-color: #ff5f5f;
  color: white;
  font-size: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

img {
  width: 100%;
}

.Booths {
  text-align: left;
}

.booths-content {
  max-height: 40vh;
  overflow-y: auto;
  padding-right: 4px;
}

.booths-content p {
  line-height: 1.6;
  margin-bottom: 12px;
}

.booths-content a {
  color: #007bff;
  text-decoration: underline;
  word-break: break-word;
}

.Venue h2 {
  text-align: left;
  max-height: 50vh;
  overflow-y: auto;
}

.comment-list {
  max-height: 60vh;
  overflow-y: auto;
}

.comment-content {
  flex: 17;
}

.comment-likes {
  flex: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.comment-likes p {
  margin: 8px 0 0 0;
  text-align: center;
}

@keyframes like-bounce {
  0% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.3) rotate(-15deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

.like-icon.animate {
  animation: like-bounce 0.3s ease;
}

.comment-item {
  border-bottom: 1px solid black;
  padding: 12px 8px;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 4px;
  color: #333;
}

.comment-user {
  font-weight: bold;
}

.comment-message {
  margin: 0;
  text-align: left;
}

.comment-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.comment-form textarea {
  margin-top: 12px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

.comment-form button {
  align-self: flex-end;
  padding: 8px 16px;
  background-color: rgb(182, 105, 214);
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
}

.comment-form button:disabled {
  background-color: #aaa;
}
</style>
