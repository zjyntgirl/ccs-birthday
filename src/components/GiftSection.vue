<template>
  <section class="gift-section q-py-xl" id="gift">
    <div class="gift-container q-mx-auto q-px-md">
      <div class="text-center q-mb-xl">
        <h2 class="section-title q-mb-sm">應援禮包</h2>
        <div class="title-bar q-mx-auto q-mb-md"></div>
        <p class="section-subtitle text-body2">
          精心準備，獻給每一位生哥的粉絲
        </p>
      </div>

      <!-- 三個禮包品相 -->
      <div class="row q-col-gutter-lg q-mb-xl justify-center">
        <div v-for="gift in gifts" :key="gift.name" class="col-4">
          <q-card class="gift-card card-accent" flat>
            <q-img :src="gift.photo" :alt="gift.name" :ratio="3 / 4">
              <div class="absolute-full gift-photo-overlay"></div>
            </q-img>
            <q-card-section class="text-center gift-info q-pa-xs">
              <div class="gift-name">{{ gift.name }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- 扭蛋機活動 -->
      <q-card class="gacha-block" flat>
        <q-card-section>
          <div
            class="gacha-header row items-center justify-center q-gutter-sm q-mb-lg"
          >
            <span class="gacha-deco">◆</span>
            <h3 class="gacha-title q-ma-none">扭蛋機活動</h3>
            <span class="gacha-deco">◆</span>
          </div>

          <q-markup-table flat bordered class="gacha-table full-width">
            <thead>
              <tr>
                <th class="text-center">賞別</th>
                <th class="text-center">品項</th>
                <th class="text-center">數量</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in gachaItems" :key="item.grade">
                <td class="text-center">
                  <span
                    class="grade-badge"
                    :class="{ 'special-badge': idx === 0 }"
                  >
                    {{ item.grade }}
                  </span>
                </td>
                <td class="text-center item-name">{{ item.name }}</td>
                <td class="text-center item-qty">{{ item.qty }} 個</td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
      </q-card>
    </div>
  </section>
</template>

<script setup>
/** 載入 gift 資料夾三張照片，依檔名排序 */
const giftModules = import.meta.glob("../../gift/*.jpg", { eager: true });
const giftPhotos = Object.keys(giftModules)
  .sort()
  .map((k) => giftModules[k].default);

/** 三個禮包品相 */
const gifts = [
  { name: "包包", photo: giftPhotos[0] },
  { name: "明信片", photo: giftPhotos[1] },
  { name: "行李掛牌", photo: giftPhotos[2] },
];

/** 扭蛋機賞品清單 */
const gachaItems = [
  { grade: "S賞", name: "小卡 1", qty: 1 },
  { grade: "A賞", name: "小卡 2", qty: 3 },
  { grade: "B賞", name: "小卡 3", qty: 16 },
  { grade: "C賞", name: "小卡 4", qty: 25 },
  { grade: "D賞", name: "小卡 5", qty: 25 },
  { grade: "E賞", name: "小卡 6", qty: 30 },
];
</script>
