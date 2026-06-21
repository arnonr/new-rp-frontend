<template>
  <div class="login-container d-flex flex-center flex-column">
    <div v-if="status === 'redirecting'" class="text-center">
      <h1 class="mb-4">{{ appName }}</h1>
      <div class="spinner-border text-primary mb-3" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="text-muted">กำลังไปหน้าเข้าสู่ระบบ KMUTNB SSO...</p>
    </div>

    <div v-else-if="status === 'error'" class="text-center">
      <h1 class="mb-4">{{ appName }}</h1>
      <p class="text-danger mb-3">{{ errorMessage }}</p>
      <button class="btn btn-primary" @click="redirectToSso">
        ลองเข้าสู่ระบบอีกครั้ง
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { buildSsoAuthorizeUrl, generateState } from "@/services/sso";

defineOptions({ name: "user-sign-in" });

const router = useRouter();
const auth = useAuthStore();

const appName = import.meta.env.VITE_APP_FULL_NAME;
const status = ref<"redirecting" | "error">("redirecting");
const errorMessage = ref("");

const redirectToSso = () => {
  const state = generateState();
  sessionStorage.setItem("sso_state", state);
  window.location.href = buildSsoAuthorizeUrl(state);
};

onMounted(() => {
  // If already logged in, skip SSO and go straight to the app home
  if (auth.isAuthenticated) {
    router.replace({ name: "paper" });
    return;
  }

  // Not logged in — redirect to SSO
  try {
    redirectToSso();
  } catch (err) {
    console.error("[Login] SSO redirect failed:", err);
    status.value = "error";
    errorMessage.value = "ไม่สามารถเชื่อมต่อ SSO ได้ กรุณาลองใหม่อีกครั้ง";
  }
});
</script>
