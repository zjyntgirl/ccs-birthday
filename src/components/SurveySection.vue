<template>
  <section class="survey-section q-py-xl" id="attendance">
    <div class="survey-container q-px-md q-mx-auto">
      <div class="text-center q-mb-xl">
        <h2 class="section-title q-mb-sm">出席調查</h2>
        <div class="title-bar q-mx-auto q-mb-md"></div>
        <p class="section-subtitle">您會想來參加陳楚生的生日活動嗎？</p>
      </div>

      <q-card class="survey-card q-pa-lg" flat>
        <!-- 已投票提示 -->
        <div v-if="userVote" class="voted-badge text-center q-mb-lg">
          你已選擇：<strong>{{
            userVote === "join" ? "參加 ｜ 歡迎入境 ❤️" : "不參加"
          }}</strong>
        </div>

        <!-- 投票按鈕 -->
        <div class="row justify-center q-gutter-xl q-mb-md">
          <q-btn
            unelevated
            rounded
            size="lg"
            :class="['survey-btn join-btn', { active: userVote === 'join' }]"
            @click="vote('join')"
          >
            <q-icon name="check_circle" class="q-mr-sm" />
            參加
          </q-btn>
          <q-btn
            unelevated
            rounded
            size="lg"
            :class="[
              'survey-btn not-join-btn',
              { active: userVote === 'notJoin' },
            ]"
            @click="vote('notJoin')"
          >
            <q-icon name="cancel" class="q-mr-sm" />
            不參加
          </q-btn>
        </div>

        <!-- 統計數字 -->
        <div class="row justify-center q-gutter-xl text-center">
          <div class="stat-item">
            <div class="stat-number join-num">{{ counts.join ?? 0 }}</div>
            <div class="stat-label">✅ 參加人數</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number not-join-num">
              {{ counts.notJoin ?? 0 }}
            </div>
            <div class="stat-label">❌ 不參加人數</div>
          </div>
        </div>
      </q-card>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { db } from "../firebase";
import { doc, onSnapshot, setDoc, increment, getDoc } from "firebase/firestore";

/** 目前投票計數 */
const counts = ref({ join: 0, notJoin: 0 });
/** 本裝置的投票選擇，null 表示尚未投票 */
const userVote = ref(null);

const SURVEY_DOC = doc(db, "survey", "counts");
const LOCAL_KEY = "ccs-survey-vote";

let unsubscribe = null;

/**
 * 執行投票，點相同選項不動作，點不同選項則切換。
 * @param {'join'|'notJoin'} option - 投票選項
 */
async function vote(option) {
  const prev = userVote.value;
  if (prev === option) return;

  const update = {};
  if (prev) update[prev] = increment(-1);
  update[option] = increment(1);

  await setDoc(SURVEY_DOC, update, { merge: true });
  userVote.value = option;
  localStorage.setItem(LOCAL_KEY, option);
}

onMounted(async () => {
  /** 讀取 localStorage，還原已投票狀態 */
  userVote.value = localStorage.getItem(LOCAL_KEY);

  /** 若 Firestore 文件尚未建立，先初始化 */
  const snap = await getDoc(SURVEY_DOC);
  if (!snap.exists()) {
    await setDoc(SURVEY_DOC, { join: 0, notJoin: 0 });
  }

  /** 即時監聽投票數變化 */
  unsubscribe = onSnapshot(SURVEY_DOC, (snap) => {
    if (snap.exists()) counts.value = snap.data();
  });
});

/** 離開時取消監聽 */
onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});
</script>
