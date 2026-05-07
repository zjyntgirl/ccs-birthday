<template>
  <section
    class="hero"
    id="hero"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <!-- 照片輪播背景（gradient 立即顯示，照片淡入） -->
    <div class="hero-bg">
      <transition name="hero-fade">
        <img
          :key="currentIndex"
          :src="heroPhotos[currentIndex]"
          class="hero-bg-img"
          alt=""
        />
      </transition>
      <div class="hero-overlay"></div>
    </div>

    <!-- 主要文字 -->
    <div class="hero-content">
      <div class="year-tag">2026</div>
      <h1 class="main-title">生日快樂</h1>
      <div class="name-row">
        <div class="name-line"></div>
        <h2 class="artist-name">陳楚生</h2>
        <div class="name-line"></div>
      </div>
      <p class="tagline">DREAMS HAPPEN</p>
    </div>

    <!-- 左右箭頭（電腦版顯示） -->
    <button
      class="hero-arrow hero-arrow--prev"
      @click="prevPhoto"
      aria-label="上一張"
    >
      &#8249;
    </button>
    <button
      class="hero-arrow hero-arrow--next"
      @click="nextPhoto"
      aria-label="下一張"
    >
      &#8250;
    </button>

    <!-- 咖啡色點導航（hover 預覽，click 鎖定） -->
    <div class="photo-dots">
      <button
        v-for="(_, idx) in heroPhotos"
        :key="idx"
        class="photo-dot"
        :class="{ active: idx === currentIndex }"
        @mouseenter="hoverTo(idx)"
        @mouseleave="resumeAuto"
        @click="jumpTo(idx)"
        :aria-label="`切換到第 ${idx + 1} 張`"
      ></button>
    </div>

    <!-- 向下捲動指示 -->
    <div class="scroll-indicator" aria-hidden="true">
      <div class="scroll-dot"></div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

/** 依檔名排序載入全部照片 */
const imageModules = import.meta.glob("../../image/*.jpg", { eager: true });
const allPhotos = Object.keys(imageModules)
  .sort()
  .map((k) => imageModules[k].default);

/** 電腦版只顯示 1-1、1-2、1-8、1-9、2.jpg（index 0,1,7,8,9） */
const DESKTOP_INDICES = [0, 1, 7, 8, 9];
const desktopPhotos = DESKTOP_INDICES.map((i) => allPhotos[i]);

const isDesktop = ref(window.innerWidth >= 600);

/** 根據螢幕寬度決定輪播清單 */
const heroPhotos = computed(() =>
  isDesktop.value ? desktopPhotos : allPhotos,
);

const currentIndex = ref(0);
let timer = null;
let paused = false;
let touchStartX = 0;
let touchStartY = 0;

/** 螢幕尺寸變更時更新 isDesktop 並重置索引 */
const onResize = () => {
  const nowDesktop = window.innerWidth >= 600;
  if (nowDesktop !== isDesktop.value) {
    isDesktop.value = nowDesktop;
    currentIndex.value = 0;
  }
};

/** 跳至指定索引 */
const jumpTo = (idx) => {
  currentIndex.value = idx;
};

/** hover 預覽：暫停自動輪播並切換 */
const hoverTo = (idx) => {
  paused = true;
  currentIndex.value = idx;
};

/** 滑鼠離開：恢復自動輪播 */
const resumeAuto = () => {
  paused = false;
};

/** 切換上一張 */
const prevPhoto = () => {
  currentIndex.value =
    (currentIndex.value - 1 + heroPhotos.value.length) %
    heroPhotos.value.length;
};

/** 切換下一張 */
const nextPhoto = () => {
  currentIndex.value = (currentIndex.value + 1) % heroPhotos.value.length;
};

/** 記錄觸控起始座標 */
const onTouchStart = (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
};

/**
 * 觸控結束時判斷滑動方向：
 * 水平位移需 > 30px 且大於垂直位移，才視為有效左右滑。
 * 向左滑（負值）→ 下一張；向右滑（正值）→ 上一張。
 */
const onTouchEnd = (e) => {
  const deltaX = e.changedTouches[0].clientX - touchStartX;
  const deltaY = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(deltaX) < 30 || Math.abs(deltaY) > Math.abs(deltaX)) return;
  if (deltaX < 0) {
    currentIndex.value = (currentIndex.value + 1) % heroPhotos.value.length;
  } else {
    currentIndex.value =
      (currentIndex.value - 1 + heroPhotos.value.length) %
      heroPhotos.value.length;
  }
};

onMounted(() => {
  window.addEventListener("resize", onResize);
  timer = setInterval(() => {
    if (!paused) {
      currentIndex.value = (currentIndex.value + 1) % heroPhotos.value.length;
    }
  }, 4000);
});

onUnmounted(() => {
  clearInterval(timer);
  window.removeEventListener("resize", onResize);
});
</script>
