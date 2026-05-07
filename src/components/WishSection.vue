<template>
  <section class="wish-section q-py-xl">
    <div class="wish-container q-px-md q-mx-auto" ref="containerRef">
      <div class="text-center q-mb-xl">
        <h2 class="section-title q-mb-sm">致親愛的生哥</h2>
        <div class="title-bar q-mx-auto"></div>
      </div>

      <q-card class="wish-box q-pa-md q-mb-md" flat>
        <q-card-section class="text-center q-pa-none">
          <p
            v-for="(line, index) in wishLines"
            :key="index"
            class="wish-line"
            :class="{
              highlight: line.highlight,
              'para-end': line.paraEnd,
              'wish-animate': isVisible,
              'wish-flash': flashActive && line.highlight,
            }"
            :style="isVisible ? { animationDelay: `${index * 0.15}s` } : {}"
          >
            {{ line.text }}
          </p>
        </q-card-section>
      </q-card>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const isVisible = ref(false);
const flashActive = ref(false);
const containerRef = ref(null);
let observer = null;

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true;
        observer.disconnect();
        /** 等 highlight 行（index 15）淡入完畢後觸發閃爍 */
        const highlightIndex = wishLines.findIndex((l) => l.highlight);
        setTimeout(() => {
          flashActive.value = true;
        }, highlightIndex * 150 + 800);
      }
    },
    { threshold: 0.15 }
  );
  if (containerRef.value) observer.observe(containerRef.value);
});

onUnmounted(() => {
  observer?.disconnect();
});

/** 祝福語文字清單，highlight 標記大字強調行，paraEnd 標記段落結尾以增加間距 */
const wishLines = [
  { text: "每一座城市", highlight: false },
  { text: "都是我們跨越山海的抵達", highlight: false, paraEnd: true },
  { text: "當你走進《荒蕪之境》", highlight: false },
  { text: "我們便帶著愛", highlight: false },
  { text: "化作守護你的風", highlight: false, paraEnd: true },
  { text: "這片境地", highlight: false },
  { text: "因你的歌聲而生機盎然", highlight: false },
  { text: "也因我們的並肩", highlight: false },
  { text: "開出了最熱烈的花", highlight: false },
  { text: "那些陪你走過的路 遇見的光", highlight: false },
  { text: "都是我們想要與你一同綻放的理由", highlight: false, paraEnd: true },
  { text: "在過去、現在和未來", highlight: false },
  { text: "因為有你", highlight: false },
  { text: "我們在荒蕪中找到了", highlight: false },
  { text: "屬於自己的黃金時代", highlight: false, paraEnd: true },
  { text: "陳楚生 生日快樂", highlight: true },
  { text: "2026 荒蕪之境 我們陪你入境", highlight: false },
];
</script>
