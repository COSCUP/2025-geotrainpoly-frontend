<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { achievements } from '../data/AchievementsData';

const avatarList = [
  '/assets/人類小啄頭像1.png',
  '/assets/人類小啄頭像2.png',
  '/assets/人類小啄頭像3.png'
];

const player = ref({
  avatar: avatarList.length > 0 ? avatarList [0] : '',
  nickname: '鱈魚',
  title: '新手小啄',
  points: 0,
  achievements: achievements,
});

const showAvatarModal = ref(false);
const selectedAvatar = ref<string | null>(null);

const openAvatarModal = () => {
  showAvatarModal.value = true;
  selectedAvatar.value = player.value.avatar;
};

const selectAvatar = (avatarPath: string) => {
  selectedAvatar.value = avatarPath;
};

const confirmAvatar = () => {
  if (selectedAvatar.value) {
    player.value.avatar = selectedAvatar.value;
  }
  showAvatarModal.value = false;
};

const closeAvatarModal = () => {
  showAvatarModal.value = false;
  selectedAvatar.value = null;
};

const availableTitles = computed(() => {
  const titles = [{ id: 0, label: '新手小啄', icon: '' }];
  player.value.achievements.forEach(achievement => {
    if (achievement.unlocked) {
      titles.push({
        id: achievement.id,
        label: achievement.label,
        icon: achievement.icon
      });
    }
  });
  return titles;
});

const handleKeydown = (event: KeyboardEvent) => {
  const key = parseInt(event.key);
  if (key >= 1 && key <= player.value.achievements.length) {
    const medalToUnlock = player.value.achievements.find(m => m.id === key);
    if (medalToUnlock && !medalToUnlock.unlocked) {
      medalToUnlock.unlocked = true;
    }
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div id="myProfile">
    <div class="avatar-section">
      <div class="avatar-container">
        <img :src="player.avatar" alt="Player Avatar" class="avatar-image">
        <button class="edit-avatar-button" @click="openAvatarModal">
          <Icon icon="material-symbols:edit-outline" />
        </button>
      </div>
    </div>

    <div class="info-section">
       <div class="display-score">{{ player.points }} 分</div>
      <div class="nickname-container">
        <span class="display-nickname">{{ player.nickname }}</span>
      </div>

      <div class="title-container">
        <select v-model="player.title" class="title-select">
          <option v-for="title in availableTitles" :key="title.id" :value="title.label">
            {{ title.label }}
          </option>
        </select>
        </div>
    </div>

    <div class="scrollable-content">
        <div class="achievements-section">
          <h3>成就</h3>
          <div class="achievements-grid">
            <div v-for="medal in player.achievements" :key="medal.id" class="medal-item">
              <Icon :icon="medal.icon" class="medal-icon" :style="{ color: medal.unlocked ? '#F8C0C8' : '#888' }" />
              <span class="medal-label">{{ medal.unlocked ? medal.label : '？？？' }}</span>
            </div>
          </div>
        </div>
    </div>

    <div v-if="showAvatarModal" class="avatar-modal-overlay" @click.self="closeAvatarModal">
      <div class="avatar-modal-content">
        <button class="popup-close" @click="closeAvatarModal">x</button>
        <h3>選擇你的頭像</h3>
        <div class="avatar-options">
          <div
            v-for="(avatarPath, index) in avatarList"
            :key="index"
            class="avatar-option"
            :class="{ 'selected': selectedAvatar === avatarPath }"
            @click="selectAvatar(avatarPath)"
          >
            <img :src="avatarPath" alt="Avatar Option" class="avatar-option-image">
          </div>
        </div>
        <button class="modal-confirm-button" @click="confirmAvatar">確定</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
#myProfile {
  width: 100%;
  height: 100%;
  background-color: #fbfaf2;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 35px 20px 20px 20px;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 0;
}

.avatar-section {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 5px;
  flex-shrink: 0;
}

.avatar-container {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #e0e6ec;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border: 4px solid #fff;
  box-shadow: 0 0 0 2px #c9d2da;
}

.edit-avatar-button {
  position: absolute;
  bottom: 5px;
  right: calc(50% - 75px + 5px);
  width: 30px;
  height: 30px;
  background-color: white;
  border-radius: 50%;
  border: 1px solid #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 0;
  font-size: 20px;
  color: #555;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  outline: none;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  z-index: 10;
}

.edit-avatar-button:hover {
  background-color: #f5f5f5;
}

.edit-avatar-button:active {
  background-color: white;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.info-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  flex-shrink: 0;
}

.display-score {
  font-size: 15px;
  font-family: 'Zen Maru Gothic', sans-serif;
  font-weight: bold;
  color: #4a4a4a;
  text-align: center;
  width: 100%;
}

.nickname-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 25px;
}

.display-nickname {
  font-size: 20px;
  font-family: 'Zen Maru Gothic', sans-serif;
  font-weight: bold;
  color: #333;
}

.title-container {
  background-color: #e6eef4;
  border-radius: 25px;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.title-select {
  flex-grow: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 16px;
  font-family: 'Zen Maru Gothic', sans-serif;
  color: #333;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  cursor: pointer;
  text-align: center;
}

.title-container::after {
  content: '▼';
  position: absolute;
  right: 15px;
  color: #888;
  font-size: 12px;
  pointer-events: none;
}

.scrollable-content {
  flex-grow: 1;
  overflow-y: auto;
  width: 100%;
  padding-right: 5px;
  box-sizing: border-box;
}

.achievements-section {
  padding: 0;
  box-sizing: border-box;
  text-align: center;
  position: relative;
  margin-top: 0;
  box-shadow: none;
}

.achievements-section h3 {
  font-size: 20px;
  font-family: 'Zen Maru Gothic', sans-serif;
  font-weight: bold;
  color: #4A4A4A;
  margin-top: 0;
  margin-bottom: 15px;
  letter-spacing: 2px;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  justify-items: center;
  margin-bottom: 70px;
}

.medal-item {
  width: 80px;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.medal-icon {
  font-size: 48px;
}

.medal-label {
  font-size: 12px;
  font-family: 'Zen Maru Gothic', sans-serif;
  color: #555;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

input:focus {
  outline: none;
}

/* Modal 相關的 CSS 樣式 */
.avatar-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow-y: auto;
}

.avatar-modal-content {
  position: relative;
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 90%;
  max-width: 400px;
  box-sizing: border-box;
}

.avatar-modal-content h3 {
  font-size: 22px;
  font-family: 'Zen Maru Gothic', sans-serif;
  font-weight: bold;
  color: #333;
  margin-bottom: 25px;
}

.avatar-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

.avatar-option {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  outline: none; /* 移除點擊時的藍色邊框 */
  -webkit-tap-highlight-color: transparent; /* 移除移動設備上點擊時的灰色/藍色背景 */
  user-select: none; /* 禁用文字選擇，防止選中高亮 */
}

.avatar-option:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.avatar-option.selected {
  border-color: #F8C0C8; /* 選中時的邊框顏色 */
  box-shadow: 0 0 0 4px #F8C0C8, 0 4px 10px rgba(0, 0, 0, 0.15);
}

/* 確保點擊時的背景色與非點擊時一致，或者設置為透明 */
.avatar-option:active {
  background-color: transparent; /* 點擊時保持透明背景，如果不需要點擊背景效果 */
}

.avatar-option-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-confirm-button {
  background-color: #aaa;
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  font-family: 'Zen Maru Gothic', sans-serif;
  transition: background-color 0.2s ease;
  outline: none; /* 移除點擊時的藍色邊框 */
  -webkit-tap-highlight-color: transparent; /* 移除移動設備上點擊時的灰色/藍色背景 */
  user-select: none; /* 禁用文字選擇，防止選中高亮 */
}

/* 確保點擊時的背景色與非點擊時一致 */
.modal-confirm-button:active {
  background-color: #aaa; /* 點擊時保持原色，或者調整為你希望的點擊效果 */
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
  cursor: pointer;
  outline: none; /* 移除點擊時的藍色邊框 */
  -webkit-tap-highlight-color: transparent; /* 移除移動設備上點擊時的灰色/藍色背景 */
  user-select: none; /* 禁用文字選擇，防止選中高亮 */
}

/* 確保點擊時的背景色與非點擊時一致 */
.popup-close:active {
  background-color: #ff5f5f; /* 點擊時保持原色，或者調整為你希望的點擊效果 */
}
</style>
