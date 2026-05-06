<template>
  <section class="contact-section q-py-xl" id="contact">
    <div class="contact-container q-mx-auto q-px-md">
      <div class="text-center q-mb-xl">
        <h2 class="section-title q-mb-sm">主辦團隊</h2>
        <div class="title-bar q-mx-auto"></div>
      </div>

      <div class="row q-col-gutter-md justify-center">
        <div
          v-for="person in organizers"
          :key="person.name"
          class="col-6 col-sm-4"
        >
          <q-card
            class="organizer-card text-center q-pt-xl q-pb-lg q-px-sm"
            flat
          >
            <q-avatar
              size="110px"
              class="photo-ring q-mb-md"
              style="border-radius: 50%; overflow: hidden"
            >
              <img
                :src="person.photo"
                :alt="person.name"
                class="organizer-photo"
                style="
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  object-position: top center;
                "
              />
            </q-avatar>
            <div class="organizer-name q-mb-xs">{{ person.name }}</div>
            <q-badge
              outline
              color="primary"
              label="主辦"
              class="organizer-tag"
            />
          </q-card>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
/** 載入 person 資料夾六張照片，依檔名排序確保順序一致 */
const personModules = import.meta.glob("../../person/*.jpg", { eager: true });
const personPhotos = Object.keys(personModules)
  .sort()
  .map((k) => personModules[k].default);

/** 六位主辦人，照片依排序配對 */
const organizers = [
  { name: "靈軒思羽", photo: personPhotos[0] },
  { name: "瑆璇", photo: personPhotos[1] },
  { name: "EY", photo: personPhotos[2] },
  { name: "夏大寶", photo: personPhotos[3] },
  { name: "暖月", photo: personPhotos[4] },
  { name: "喳喳", photo: personPhotos[5] },
];
</script>
