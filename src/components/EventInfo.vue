<template>
  <section class="event-info q-py-xl" id="event">
    <div class="event-container q-mx-auto q-px-md">
      <div class="text-center q-mb-xl">
        <h2 class="section-title q-mb-sm">生日應援展</h2>
        <div class="title-bar q-mx-auto"></div>
      </div>

      <div class="row q-col-gutter-lg justify-center q-mb-xl" ref="cardsRef">
        <div
          v-for="(item, idx) in eventItems"
          :key="item.id"
          class="col-4 card-wrapper"
          :style="{ transitionDelay: idx * 100 + 'ms' }"
        >
          <q-card class="info-card card-accent full-height" flat bordered>
            <q-card-section class="text-center q-pa-xs">
              <div class="card-icon q-mb-md">{{ item.icon }}</div>
              <div class="card-label text-caption text-weight-bold q-mb-sm">
                {{ item.label }}
              </div>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div
                class="card-value text-weight-bold"
                v-html="item.value"
              ></div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div
        class="guitar-divider row items-center justify-center q-gutter-sm"
        aria-hidden="true"
      >
        <span>🎸</span>
        <div class="divider-line"></div>
        <span>🎵</span>
        <div class="divider-line"></div>
        <span>🎸</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const cardsRef = ref(null);
let observer = null;

/** 生日應援展卡片清單 */
const eventItems = [
  {
    id: 1,
    icon: "📅",
    label: "活動時間",
    value: "7月18日（六）<br>7月19日（日）",
  },
  {
    id: 2,
    icon: "📍",
    label: "活動地點",
    value: "Wannaeat<br>好想吃甜點工作室",
  },
  {
    id: 3,
    icon: "👑",
    label: "主辦單位",
    value: "陳楚生CCS<br>再就業女孩",
  },
];

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 },
  );
  cardsRef.value
    ?.querySelectorAll(".card-wrapper")
    .forEach((el) => observer.observe(el));
});

onUnmounted(() => observer?.disconnect());
</script>
