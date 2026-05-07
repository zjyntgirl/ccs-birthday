<template>
  <header class="nav-header">
    <div class="row items-center justify-between q-px-lg q-mx-auto nav-inner">
      <a href="#hero" class="nav-logo row items-center q-gutter-xs">
        <span class="text-weight-bolder">陳楚生 2026 生日展</span>
        <span class="logo-mark">🦈</span>
      </a>

      <button
        class="hamburger lt-sm"
        :class="{ open: menuOpen }"
        @click="menuOpen = !menuOpen"
        aria-label="選單"
      >
        <span></span><span></span><span></span>
      </button>

      <nav class="row items-center q-gutter-lg gt-xs">
        <a href="#event" class="nav-link" @click="close">生日應援展</a>
        <!-- <a href="#gift" class="nav-link" @click="close">應援禮包</a> -->
        <a href="#attendance" class="nav-link" @click="close">出席調查</a>
        <a href="#contact" class="nav-link" @click="close">主辦團隊</a>
        <a href="#message-board" class="nav-link" @click="close">留言板</a>
      </nav>
    </div>

    <!-- 手機展開選單 -->
    <nav v-if="menuOpen" class="mobile-menu column lt-sm">
      <a href="#event" class="mobile-link" @click="close">生日應援展</a>
      <!-- <a href="#gift" class="mobile-link" @click="close">應援禮包</a> -->
      <a href="#attendance" class="mobile-link" @click="close">出席調查</a>
      <a href="#contact" class="mobile-link" @click="close">主辦團隊</a>
      <a href="#message-board" class="mobile-link" @click="close">留言板</a>
    </nav>
  </header>
</template>

<script setup>
import { ref } from "vue";

const menuOpen = ref(false);
/** 關閉行動選單 */
const close = () => {
  menuOpen.value = false;
};
</script>
