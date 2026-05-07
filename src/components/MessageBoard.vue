<template>
  <section class="message-section q-py-xl" id="message-board">
    <div class="message-container q-px-md q-mx-auto">
      <div class="text-center q-mb-xl">
        <h2 class="section-title section-title--light q-mb-sm">留言板</h2>
        <div class="title-bar q-mx-auto q-mb-md"></div>
        <p class="section-subtitle section-subtitle--light">
          請留下對生哥的祝福吧！
        </p>
      </div>

      <!-- 輸入區 -->
      <q-card class="message-input-card q-pa-lg q-mb-xl" flat>
        <!-- 已留言提示 -->
        <div v-if="hasPosted" class="posted-badge text-center q-mb-md">
          已收到 💌
        </div>

        <div class="row q-col-gutter-sm">
          <div class="col-12 col-sm-3">
            <q-input
              v-model="nickname"
              outlined
              label="暱稱（選填）"
              maxlength="20"
              :disable="hasPosted"
              class="message-field full-height-field"
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-input
              v-model="content"
              outlined
              label="寫下你的祝福..."
              maxlength="200"
              :disable="hasPosted"
              class="message-field full-height-field"
              @keyup.enter="submitMessage"
            />
          </div>
          <div class="col-12 col-sm-3">
            <q-btn
              :disable="!content.trim() || submitting || hasPosted"
              unelevated
              class="full-width submit-btn"
              @click="submitMessage"
            >
              <q-icon name="send" class="q-mr-xs" />送出
            </q-btn>
          </div>
        </div>
      </q-card>

      <!-- 留言列表 -->
      <div
        v-if="messages.length === 0"
        class="text-center q-py-xl message-empty"
      >
        還沒有留言，快來第一個留言吧 🎸
      </div>

      <transition-group name="msg-fade" tag="div" class="message-list">
        <q-card
          v-for="msg in displayedMessages"
          :key="msg.id"
          class="message-item q-pa-md q-mb-md"
          :class="{ 'my-message': msg.id === myMessageId }"
          flat
        >
          <div class="row items-start no-wrap">
            <q-avatar size="38px" class="msg-avatar q-mr-md flex-shrink-0">
              {{ firstChar(msg.nickname) }}
            </q-avatar>
            <div class="col">
              <div class="row items-center q-mb-xs">
                <span class="msg-name q-mr-sm">{{ msg.nickname }}</span>
                <span class="msg-time">{{ formatTime(msg.createdAt) }}</span>
              </div>
              <div class="msg-content">{{ msg.content }}</div>
            </div>
            <q-btn
              v-if="msg.id === myMessageId"
              flat
              round
              dense
              icon="delete_outline"
              class="delete-btn q-ml-sm"
              @click="confirmDelete(msg.id)"
            />
          </div>
        </q-card>
      </transition-group>

      <!-- 顯示更多 / 收起按鈕（統一放在列表下方） -->
      <div v-if="hiddenCount > 0" class="text-center q-mt-sm">
        <q-btn flat class="show-more-btn" @click="showAll = !showAll">
          <q-icon
            :name="showAll ? 'expand_less' : 'expand_more'"
            class="q-mr-xs"
          />
          {{ showAll ? "收起" : `顯示更多留言（還有 ${hiddenCount} 則）` }}
        </q-btn>
      </div>
    </div>

    <!-- 刪除確認對話框 -->
    <q-dialog v-model="showDeleteDialog">
      <q-card class="delete-dialog q-pa-md">
        <q-card-section class="text-center">
          <div class="text-h6 q-mb-sm">確認刪除</div>
          <div class="text-body2">確定要刪除這則留言嗎？</div>
        </q-card-section>
        <q-card-actions align="center" class="q-gutter-sm">
          <q-btn flat rounded label="取消" v-close-popup class="cancel-btn" />
          <q-btn
            unelevated
            rounded
            label="刪除"
            class="confirm-delete-btn"
            @click="deleteMessage"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

/** 暱稱輸入值 */
const nickname = ref("");
/** 留言內容輸入值 */
const content = ref("");
/** 留言列表 */
const messages = ref([]);
/** 送出防連點 */
const submitting = ref(false);
/** 本裝置是否已發過留言 */
const hasPosted = ref(false);
/** 本裝置發出的留言 ID，用於高亮自己的留言 */
const myMessageId = computed(() => localStorage.getItem(LOCAL_KEY));
/** 刪除確認對話框顯示狀態 */
const showDeleteDialog = ref(false);
/** 待刪除的留言 ID */
const pendingDeleteId = ref(null);

const MESSAGES_COL = collection(db, "messages");
const LOCAL_KEY = "ccs-message-id";
const OTHERS_LIMIT = 2;
/** 是否展開所有留言 */
const showAll = ref(false);
let unsubscribe = null;

/**
 * 計算要顯示的留言清單：
 * 他人留言統一由新到舊排列；
 * 未留言時顯示最新 3 則；已留言時自己置頂 + 最新 2 則他人留言。
 * showAll 為 true 時顯示全部。
 */
const displayedMessages = computed(() => {
  const myId = localStorage.getItem(LOCAL_KEY);
  const myMsg = myId ? messages.value.find((m) => m.id === myId) : null;
  // 他人留言由新到舊（reverse 不影響原陣列，filter 已建立新陣列）
  const others = messages.value.filter((m) => m.id !== myId).reverse();

  if (showAll.value) {
    return myMsg ? [myMsg, ...others] : messages.value.slice().reverse();
  }

  if (myMsg) {
    return [myMsg, ...others.slice(0, OTHERS_LIMIT)];
  }
  return messages.value.slice(-3).reverse();
});

/** 超出預設顯示範圍的留言數 */
const hiddenCount = computed(() => {
  const myId = localStorage.getItem(LOCAL_KEY);
  const myMsg = myId ? messages.value.find((m) => m.id === myId) : null;
  if (myMsg) {
    const othersCount = messages.value.filter((m) => m.id !== myId).length;
    return Math.max(0, othersCount - OTHERS_LIMIT);
  }
  return Math.max(0, messages.value.length - 3);
});

/** 取暱稱第一個字作為頭像顯示 */
function firstChar(name) {
  return name ? name[0] : "匿";
}

/**
 * 格式化 Firestore Timestamp 為可讀時間字串。
 * @param {import('firebase/firestore').Timestamp|null} ts
 */
function formatTime(ts) {
  if (!ts) return "";
  return ts.toDate().toLocaleString("zh-TW", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** 送出新留言，並將留言 ID 存入 localStorage 防止重複發送 */
async function submitMessage() {
  const text = content.value.trim();
  // if (!text || submitting.value || hasPosted.value) return;
  submitting.value = true;
  try {
    const docRef = await addDoc(MESSAGES_COL, {
      nickname: nickname.value.trim() || "匿名",
      content: text,
      createdAt: serverTimestamp(),
    });
    localStorage.setItem(LOCAL_KEY, docRef.id);
    hasPosted.value = true;
    content.value = "";
  } finally {
    submitting.value = false;
  }
}

/** 開啟刪除確認對話框 */
function confirmDelete(id) {
  pendingDeleteId.value = id;
  showDeleteDialog.value = true;
}

/** 確認後刪除留言 */
async function deleteMessage() {
  if (!pendingDeleteId.value) return;
  await deleteDoc(doc(db, "messages", pendingDeleteId.value));
  showDeleteDialog.value = false;
  pendingDeleteId.value = null;
}

onMounted(() => {
  /** 還原已發留言狀態 */
  const savedId = localStorage.getItem(LOCAL_KEY);
  if (savedId) hasPosted.value = true;

  /** 依發布時間升序即時監聽留言，並偵測本裝置留言是否已被刪除 */
  const q = query(MESSAGES_COL, orderBy("createdAt", "asc"));
  unsubscribe = onSnapshot(q, (snap) => {
    const ids = new Set(snap.docs.map((d) => d.id));
    messages.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    /** 若本裝置的留言已不在列表中，自動解鎖送出 */
    const currentId = localStorage.getItem(LOCAL_KEY);
    if (currentId && !ids.has(currentId)) {
      localStorage.removeItem(LOCAL_KEY);
      hasPosted.value = false;
    }
  });
});

/** 離開時取消監聽 */
onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});
</script>
