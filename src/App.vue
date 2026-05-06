<template>
  <div class="app">
    <NavHeader />
    <HeroSection />
    <EventInfo />
    <GiftSection />
    <ContactSection />
    <WishSection />
    <SurveySection />
    <MessageBoard />
    <footer class="site-footer">
      <div class="footer-inner">
        <p>COPYRIGHT © 夏大寶 ALL RIGHTS RESERVED</p>
        <p class="footer-year">2026</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
/** 引入各頁面區塊元件 */
import NavHeader from "./components/NavHeader.vue";
import HeroSection from "./components/HeroSection.vue";
import EventInfo from "./components/EventInfo.vue";
import GiftSection from "./components/GiftSection.vue";
import WishSection from "./components/WishSection.vue";
import SurveySection from "./components/SurveySection.vue";
import MessageBoard from "./components/MessageBoard.vue";
import ContactSection from "./components/ContactSection.vue";
</script>
