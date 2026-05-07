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
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div class="card-icon q-mt-sm q-mb-md" v-html="item.icon"></div>
              <div class="card-label text-caption text-weight-bold q-mb-sm" style="margin-top: -8px">
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

      <!-- 詳細地址 -->
      <div class="location-info-row q-mb-lg">
        <div class="location-label">🏠 地址</div>
        <div class="location-value">台北市信義區永吉路30巷158弄23號</div>
      </div>

      <!-- Google Maps -->
      <div class="map-wrapper map-anim" ref="mapRef">
        <iframe
          src="https://maps.google.com/maps?q=25.04249,121.567815&z=15&output=embed"
          class="location-map"
          allowfullscreen
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Wannaeat 好想吃甜點工作室位置"
        ></iframe>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const cardsRef = ref(null);
const mapRef = ref(null);
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
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="#8B6355"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
    label: "主辦單位",
    value: '<a href="https://www.instagram.com/love___ccs?igsh=cTJyMG1jZThoNjd2" target="_blank" rel="noopener noreferrer">陳楚生CCS</a><br><a href="https://www.instagram.com/zjynt.girl0408?igsh=cTZ0ZmJwZXV4MTlp" target="_blank" rel="noopener noreferrer">再就業女孩</a>',
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
  if (mapRef.value) observer.observe(mapRef.value);
});

onUnmounted(() => observer?.disconnect());
</script>

<style scoped>
.location-info-row {
  text-align: center;
}
.location-label {
  font-size: 0.82rem;
  letter-spacing: 0.18em;
  color: var(--coffee-medium);
  font-weight: 700;
  margin-bottom: 0.3rem;
}
.location-value {
  font-size: 1rem;
  color: var(--text-dark);
  letter-spacing: 0.06em;
}

.map-wrapper {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(139, 99, 85, 0.18);
  box-shadow: 0 4px 20px rgba(62, 39, 35, 0.08);
}

.map-anim {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.map-anim.visible {
  opacity: 1;
  transform: translateY(0);
}

.location-map {
  width: 100%;
  height: 180px;
  border: none;
  display: block;
}

@media (max-width: 600px) {
  .location-map {
    height: 130px;
  }
}
</style>
