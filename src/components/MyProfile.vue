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
  points: 680,
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

const showTitleDropdown = ref(false);

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

const toggleTitleDropdown = () => {
  showTitleDropdown.value = !showTitleDropdown.value;
};

const selectTitle = (titleLabel: string) => {
  player.value.title = titleLabel;
  showTitleDropdown.value = false;
};

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
  document.addEventListener('click', closeDropdownOnClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  document.removeEventListener('click', closeDropdownOnClickOutside);
});

const closeDropdownOnClickOutside = (event: MouseEvent) => {
  const titleContainer = document.querySelector('.title-container');
  if (titleContainer && !titleContainer.contains(event.target as Node)) {
    showTitleDropdown.value = false;
  }
};
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
        <div class="current-title" @click="toggleTitleDropdown">
          {{ player.title }}
        </div>

        <transition name="fade-slide-down">
          <div v-if="showTitleDropdown" class="title-dropdown-list">
            <div
              v-for="title in availableTitles"
              :key="title.id"
              class="title-dropdown-item"
              :class="{ 'selected-title': player.title === title.label }"
              @click="selectTitle(title.label)"
            >
              {{ title.label }}
            </div>
          </div>
        </transition>
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
        <h3>選擇喜歡的頭像</h3>
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
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.title-container::after {
  content: '▼';
  position: absolute;
  right: 15px;
  color: #888;
  font-size: 12px;
  pointer-events: none;
}

.current-title {
  flex-grow: 1;
  text-align: center;
  font-size: 16px;
  font-family: 'Zen Maru Gothic', sans-serif;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 50;
  border: 1px solid #e0e6ec;
  padding: 5px 0;
}

.title-dropdown-item {
  padding: 10px 15px;
  font-size: 16px;
  font-family: 'Zen Maru Gothic', sans-serif;
  color: #333;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.2s ease, color 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.title-dropdown-item:hover {
  background-color: #f0f5f9;
}


.title-dropdown-item:active {
  background-color: #e6eef4;
}

.title-dropdown-item.selected-title {
  font-weight: bold;
  color: #007bff;
}

.fade-slide-down-enter-active,
.fade-slide-down-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-slide-down-enter-from,
.fade-slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
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
  padding: 20px;
}

.avatar-modal-content h3 {
  font-size: 22px;
  font-family: 'Zen Maru Gothic', sans-serif;
  font-weight: bold;
  color: #333;
  margin: 10px 0px;
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
  outline: none;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.avatar-option:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.avatar-option.selected {
  border-color: #F8C0C8; 
  box-shadow: 0 0 0 3px #F8C0C8, 0 4px 10px rgba(0, 0, 0, 0.15);
}

.avatar-option:active {
  background-color: transparent;
}

.avatar-option-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-confirm-button {
  background-color: #F8C0C8;
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  font-family: 'Zen Maru Gothic', sans-serif;
  transition: background-color 0.2s ease;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.modal-confirm-button:active {
  background-color: #aaa;
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
  outline: none;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.popup-close:active {
  background-color: #ff5f5f;
}
</style>
